import { Request, Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service';
import { Lead } from '../models/Lead';
import { LeadFilterService } from '../services/leadFilter.service';
import { FilterQuery } from '../types';
import { sendResponse } from '../utils/response';
import { convertToCSV } from '../utils/csv';

export class LeadController {
  /**
   * POST /api/leads
   * Create a new lead scoped under the calling user
   */
  public static create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const lead = await LeadService.createLead({
        ...req.body,
        createdBy: userId,
      });

      sendResponse(res, 201, lead, req.originalUrl || req.path);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/leads
   * Retrieve list of leads with pagination, advanced search, and filters
   */
  public static list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;
      
      const query: FilterQuery = {
        status: req.query.status as any,
        source: req.query.source as any,
        search: req.query.search as string,
        sortBy: req.query.sortBy as any,
        page: req.query.page as any,
        limit: req.query.limit as any,
      };

      const filter = LeadFilterService.buildFilter({ ...query, userId, role });
      const sort = LeadFilterService.buildSort(query.sortBy);
      const { skip, limit, page } = LeadFilterService.getPagination(query.page, query.limit);

      const [rawLeads, total] = await Promise.all([
        Lead.find(filter)
          .skip(skip)
          .limit(limit)
          .sort(sort)
          .lean(),
        Lead.countDocuments(filter),
      ]);

      const leads = rawLeads.map((item: any) => ({
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

      const totalPages = Math.ceil(total / limit);

      res.status(200).json({
        success: true,
        data: leads,
        meta: {
          timestamp: new Date().toISOString(),
          path: req.originalUrl || req.path,
          pagination: {
            page,
            limit,
            total,
            totalPages: totalPages === 0 ? 1 : totalPages,
            hasNext: page * limit < total,
            hasPrev: page > 1,
          },
          filters: {
            status: query.status || null,
            source: query.source || null,
            search: query.search || '',
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/leads/:id
   * Get details for a single lead
   */
  public static getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;
      const { id } = req.params;

      const lead = await LeadService.getLeadById(id, userId, role);

      sendResponse(res, 200, lead, req.originalUrl || req.path);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/leads/:id
   * Update details of an existing lead
   */
  public static update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;
      const { id } = req.params;

      const lead = await LeadService.updateLead(id, req.body, userId, role);

      sendResponse(res, 200, lead, req.originalUrl || req.path);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/leads/:id
   * Delete an existing lead
   */
  public static delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;
      const { id } = req.params;

      await LeadService.deleteLead(id, userId, role);

      sendResponse(
        res,
        200,
        { message: 'Lead successfully deleted' },
        req.originalUrl || req.path
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/leads/export/csv
   * Export all filtered leads matching search criteria as RFC 4180 CSV
   */
  public static exportCSV = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;

      // Extract filter criteria from query params or request body
      const status = (req.query.status || req.body.status) as string | undefined;
      const source = (req.query.source || req.body.source) as string | undefined;
      const search = (req.query.search || req.body.search) as string | undefined;
      const sortBy = ((req.query.sortBy || req.body.sortBy) as string) || 'latest';

      // Call the service with high page limit to fetch matching database entries (no pagination)
      const { leads } = await LeadService.getLeads({
        userId,
        role,
        status,
        source,
        search,
        sortBy,
        page: 1,
        limit: 100000,
      });

      const formatDate = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        const yyyy = date.getFullYear();
        const mm = pad(date.getMonth() + 1);
        const dd = pad(date.getDate());
        const hh = pad(date.getHours());
        const min = pad(date.getMinutes());
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
      };

      const transformedRows = leads.map((lead: any) => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        createdAt: formatDate(new Date(lead.createdAt)),
        createdBy: req.user!.email,
      }));

      const fields = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
        { key: 'source', label: 'Source' },
        { key: 'createdAt', label: 'Created At' },
        { key: 'createdBy', label: 'Created By' },
      ];

      const csvContent = convertToCSV(transformedRows, fields);

      // Set headers to trigger direct browser file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=leads_export_${Date.now()}.csv`
      );

      res.status(200).send(csvContent);
    } catch (error) {
      next(error);
    }
  };
}
export default LeadController;
