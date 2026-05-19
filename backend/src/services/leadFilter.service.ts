import mongoose from 'mongoose';
import { FilterQuery } from '../types';

export class LeadFilterService {
  /**
   * Build MongoDB query filter object, applying search and security scope filters.
   */
  public static buildFilter(query: FilterQuery & { userId: string; role: string }): any {
    const filter: any = {};

    // Restrict queries to user's leads if they are not an administrator
    if (query.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(query.userId);
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.source) {
      filter.source = query.source;
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    return filter;
  }

  /**
   * Determine Mongoose sorting options object.
   */
  public static buildSort(sortBy?: string): Record<string, 1 | -1> {
    return sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
  }

  /**
   * Process page and limit constraints and return database cursor parameters.
   */
  public static getPagination(page?: number, limit?: number) {
    const p = Math.max(1, page || 1);
    const l = Math.min(limit || 10, 50); // Cap limit at 50 as per instructions
    return { skip: (p - 1) * l, limit: l, page: p };
  }
}
export default LeadFilterService;
