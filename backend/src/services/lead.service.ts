import mongoose from 'mongoose';
import { Lead } from '../models/Lead';
import { ILead, IPaginationMeta } from '../types';
import { ValidationError, NotFoundError, ForbiddenError } from '../utils/errors';
import { SORT_BY } from '../constants';

export class LeadService {
  /**
   * Create a new lead
   */
  public static async createLead(leadData: {
    name: string;
    email: string;
    status?: string;
    source: string;
    notes?: string;
    createdBy: string;
  }): Promise<ILead> {
    // Check if lead with same email already exists for this specific user
    const existing = await Lead.findOne({
      email: leadData.email.toLowerCase(),
      createdBy: new mongoose.Types.ObjectId(leadData.createdBy),
    });

    if (existing) {
      throw new ValidationError('A lead with this email address already exists in your account');
    }

    const lead = new Lead({
      ...leadData,
      createdBy: new mongoose.Types.ObjectId(leadData.createdBy),
    });

    await lead.save();
    return lead.toSafeLead();
  }

  /**
   * Get a single lead by ID, with authorization checks
   */
  public static async getLeadById(
    id: string,
    userId: string,
    role: string
  ): Promise<ILead> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid lead ID format');
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    // Role-based visibility: Sales users can only see their own leads, Admins see all
    if (role !== 'admin' && lead.createdBy.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to view this lead');
    }

    return lead.toSafeLead();
  }

  /**
   * Update lead details, with authorization checks
   */
  public static async updateLead(
    id: string,
    leadData: Partial<{
      name: string;
      email: string;
      status: string;
      source: string;
      notes: string;
    }>,
    userId: string,
    role: string
  ): Promise<ILead> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid lead ID format');
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    // Permissions check
    if (role !== 'admin' && lead.createdBy.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to update this lead');
    }

    // If email is changing, make sure it stays unique for this user
    if (leadData.email && leadData.email.toLowerCase() !== lead.email) {
      const existing = await Lead.findOne({
        email: leadData.email.toLowerCase(),
        createdBy: lead.createdBy,
        _id: { $ne: lead._id }, // Exclude current lead
      });

      if (existing) {
        throw new ValidationError('A lead with this email address already exists in your account');
      }
    }

    // Update fields
    Object.assign(lead, leadData);
    await lead.save();

    return lead.toSafeLead();
  }

  /**
   * Delete a lead, with authorization checks
   */
  public static async deleteLead(
    id: string,
    userId: string,
    role: string
  ): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid lead ID format');
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    // Permissions check
    if (role !== 'admin' && lead.createdBy.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to delete this lead');
    }

    await lead.deleteOne();
  }

  /**
   * Query leads using a high-performance MongoDB aggregation pipeline
   */
  public static async getLeads(params: {
    userId: string;
    role: string;
    status?: string;
    source?: string;
    search?: string;
    sortBy: string;
    page: number;
    limit: number;
  }): Promise<{ leads: ILead[]; pagination: IPaginationMeta }> {
    const matchStage: any = {};

    // Filter by user context: Sales users can only query their own leads
    if (params.role !== 'admin') {
      matchStage.createdBy = new mongoose.Types.ObjectId(params.userId);
    }

    // Status filter
    if (params.status) {
      matchStage.status = params.status;
    }

    // Source filter
    if (params.source) {
      matchStage.source = params.source;
    }

    // Case-insensitive search on name or email using regex
    if (params.search) {
      matchStage.$or = [
        { name: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } },
      ];
    }

    const sortOrder = params.sortBy === SORT_BY.OLDEST ? 1 : -1;
    const skipAmount = (params.page - 1) * params.limit;

    // Build the aggregation pipeline using $facet to fetch count and records in one operation
    const pipeline: any[] = [
      { $match: matchStage },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $sort: { createdAt: sortOrder } },
            { $skip: skipAmount },
            { $limit: params.limit },
          ],
        },
      },
    ];

    const result = await Lead.aggregate(pipeline);

    const total = result[0]?.metadata[0]?.total ?? 0;
    const rawLeads = result[0]?.data ?? [];

    const leads: ILead[] = rawLeads.map((item: any) => ({
      id: item._id.toString(),
      name: item.name,
      email: item.email,
      status: item.status,
      source: item.source,
      createdBy: item.createdBy.toString(),
      notes: item.notes,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    const totalPages = Math.ceil(total / params.limit);

    const pagination: IPaginationMeta = {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: totalPages === 0 ? 1 : totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    };

    return { leads, pagination };
  }
}
export default LeadService;
