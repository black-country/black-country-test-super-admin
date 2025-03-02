import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { unparse as papaparseUnparse } from 'papaparse';
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export type ExportType = 'csv' | 'pdf' | 'excel';

export const downloadableColumns = ref([])

export function usePaginatedFetchAndDownload() {
  const isDownloading = ref(false);
  const mergedData = ref([] as Array<Record<string, any>>);
  const total_pages = ref(0);
  const error = ref(null) as Record<string, any>;

  async function fetchDataPage(url: string, page: number) {
    try {
      const response = await GATEWAY_ENDPOINT.get(`${url}?page=${page}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch page ${page}: ${error.message}`);
    }
  }

  async function fetchAllPages(url: string) {
    isDownloading.value = true;
    error.value = null;
    mergedData.value = [];

    try {
      const firstPageData = await fetchDataPage(url, 1);
      const totalPages = firstPageData.metadata.pages;
      total_pages.value = totalPages;

      const pagePromises = [];
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(fetchDataPage(url, page));
      }

      const allPageData = await Promise.all(pagePromises);
      mergedData.value = [
        ...firstPageData.result,
        ...allPageData.flatMap(page => page.data)
      ];
    } catch (e) {
      useNuxtApp().$toast.error('Something went wrong while downloading the report.', {
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
      error.value = e;
    } finally {
      isDownloading.value = false;
    }
  }

  async function exportPaginatedData(
    url: string,
    exportType: ExportType,
    fileName: string = 'export',
    dataKeys: string[],  // Accepting data keys dynamically
    customHeaderMapping: Record<string, string> = {}
  ) {
    await fetchAllPages(url);
    if (!mergedData.value || mergedData.value.length === 0) {
      promptModal(exportType.toUpperCase(), 'error');
      console.error('No data available for export');
      return;
    }

    exportData(mergedData.value, exportType, fileName, dataKeys, customHeaderMapping); // Passing data keys to exportData
  }

  return { exportPaginatedData, isDownloading, error, mergedData, total_pages };
}

export function exportData(
  data: Array<Record<string, any>>,
  exportType: ExportType,
  fileName: string = 'export',
  dataKeys: string[], // New parameter to specify the keys dynamically
  customHeaderMapping: Record<string, string> = {}
): void {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Helper function to extract nested property values
  const extractValue = (obj: Record<string, any>, key: string) => {
    return key.split('.').reduce((o, k) => (o ? o[k] : null), obj);
  };

  // Helper function to format header names
  const formatHeader = (key: string) => {
    if (customHeaderMapping[key]) {
      return customHeaderMapping[key]; // Use custom header if available
    }
    return key
      .replace(/\./g, ' ') // Replace dot notation with space
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
  };

  // Filter the data based on the keys provided by the user
  const filteredData = data.map(item => {
    const filteredItem: Record<string, any> = {};
    dataKeys.forEach(key => {
      filteredItem[key] = extractValue(item, key); // Use the helper to extract nested values
    });
    return filteredItem;
  });

  // Prepare formatted headers
  const formattedHeaders = dataKeys.map(key => formatHeader(key));

  switch (exportType) {
    case 'csv':
      exportAsCSV(filteredData, fileName, formattedHeaders); // Pass formatted headers
      break;
    case 'pdf':
      exportAsPDF(filteredData, fileName, formattedHeaders); // Pass formatted headers
      break;
    case 'excel':
      exportAsExcel(filteredData, fileName, formattedHeaders); // Pass formatted headers
      break;
    default:
      console.error('Invalid export type:', exportType);
      promptModal(exportType.toUpperCase(), 'error');
  }
}

async function exportAsCSV(data: Array<Record<string, any>>, fileName: string, headers: string[]) {
  try {
    const csvData = [headers, ...data.map(item => Object.values(item))]; // Add headers as the first row
    const csv = papaparseUnparse(csvData);
    await new Promise<void>((resolve, reject) => {
      try {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${fileName}.csv`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    promptModal('CSV', 'success');
  } catch (error) {
    promptModal('CSV', 'error');
    console.error('Error exporting CSV:', error);
  }
}


async function exportAsPDF(data: Array<Record<string, any>>, fileName: string, headers: string[]) {
  try {
    const doc = new jsPDF('l', 'mm', 'a4');
    const rows = data.map(item => Object.values(item));

    await new Promise<void>((resolve, reject) => {
      try {
        autoTable(doc, {
          head: [headers],
          body: rows,
          styles: {
            cellPadding: 4,
            halign: 'center',
            valign: 'middle',
          },
        });

        doc.save(`${fileName}.pdf`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    promptModal('PDF', 'success');
  } catch (error) {
    promptModal('PDF', 'error');
    console.error('Error exporting PDF:', error);
  }
}

async function exportAsExcel(data: Array<Record<string, any>>, fileName: string, headers: string[]) {
  try {
    const worksheetData = [headers, ...data.map(item => Object.values(item))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    await new Promise<void>((resolve, reject) => {
      try {
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    promptModal('EXCEL', 'success');
  } catch (error) {
    promptModal('EXCEL', 'error');
    console.error('Error exporting Excel:', error);
  }
}


const promptModal = (type: 'CSV' | 'PDF' | 'EXCEL', status: 'success' | 'error') => {
  Swal.fire({
    title: status === 'success' ? 'Success' : 'Error',
    text: `${type} was ${status === 'success' ? 'exported successfully' : 'not exported'}!`,
    icon: status,
    showCancelButton: false,
    showConfirmButton: true,
    confirmButtonText: "OK",
    confirmButtonColor: "#3085d6",
  });
};
