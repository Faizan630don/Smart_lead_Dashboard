/**
 * Utility to convert an array of objects into RFC 4180 compliant CSV format.
 * Correctly handles escaping of commas, double quotes, and line breaks.
 */
export const convertToCSV = (
  data: Array<Record<string, any>>,
  fields: { key: string; label: string }[]
): string => {
  const headers = fields.map((f) => `"${f.label.replace(/"/g, '""')}"`).join(',');

  const rows = data.map((item) => {
    return fields
      .map((field) => {
        const val = item[field.key];
        if (val === undefined || val === null) {
          return '';
        }

        let strVal = '';
        if (val instanceof Date) {
          strVal = val.toISOString();
        } else {
          strVal = String(val);
        }

        // Escape double quotes by doubling them
        const escaped = strVal.replace(/"/g, '""');

        // Check if value needs to be wrapped in double quotes
        if (
          escaped.includes(',') ||
          escaped.includes('"') ||
          escaped.includes('\n') ||
          escaped.includes('\r')
        ) {
          return `"${escaped}"`;
        }

        return escaped;
      })
      .join(',');
  });

  return [headers, ...rows].join('\r\n');
};
