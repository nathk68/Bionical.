import { GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');
