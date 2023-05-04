import type { Request } from 'playwright';

export interface Site {
  url: string;
  gtms?: string[];
  ga3Properties?: string[];
  ga4Properties?: string[];
  redirects?: string[];
  error?: string;
  visited?: boolean;
}

type RedirectObj = {
  url: string;
  timestamp: number;
}

export function flatRequestUrl(req: Request): string {
  return (req.url() + '&' + (req.postData() || ''))
    .replace(/\r\n|\n|\r/g, '&')
    .replace(/&&/, '&')
    .replace(/&$/g, '');
}

export const flatRequestMatch = (req: Request, regex: RegExp) =>
  !!flatRequestUrl(req).match(regex);

export function jsonarray2csv(json: { [key: string]: any }[]) {
  // clona para não alterar o original
  json = JSON.parse(JSON.stringify(json));
  const headerKeys = Object.keys(json[0]);
  let csvString = '';
  // forma o header
  headerKeys.forEach(
    (key, idx, self) =>
      (csvString += key + (idx < self.length - 1 ? ',' : '\n'))
  );
  json.forEach(rowObj => {
    headerKeys.forEach((headerKey, idx, self) => {
      // caso o valor seja array, transforma-o numa string separada por ", "
      if (Array.isArray(rowObj[headerKey]))
        rowObj[headerKey] = rowObj[headerKey].join(', ');
      // caso o valor possua vírgula, envolvê-lo em aspas duplas
      if (
        typeof rowObj[headerKey] === 'string' &&
        rowObj[headerKey].includes(',') &&
        !rowObj[headerKey].startsWith('"') &&
        !rowObj[headerKey].endsWith('"')
      ) {
        rowObj[headerKey] = '"' + rowObj[headerKey] + '"';
      }
      // forma a linha
      csvString +=
        (headerKey in rowObj ? rowObj[headerKey] : '') +
        (idx < self.length - 1 ? ',' : '\n');
    });
  });
  return csvString;
}
