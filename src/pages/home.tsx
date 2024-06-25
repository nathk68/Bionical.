import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, Link, Paper, IconButton, Tooltip, Modal } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import NavBar from './Components/NavBar';
import FileInfo from './Components/FileInfo';
import { convertToBionicReading } from '../utils/bionicReading';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { pdfjs, Document, Page } from 'react-pdf';

// Set workerSrc to the local path of the pdf.worker.js file
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


const Home: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [bionicText, setBionicText] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isFileMode, setIsFileMode] = useState<boolean>(false);
    const [fileInfo, setFileInfo] = useState<{ name: string; type: string; size: number, file: File } | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pdfText, setPdfText] = useState<string>('');

    const handleConvertText = () => {
        const convertedText = convertToBionicReading(isFileMode ? pdfText : inputText);
        setBionicText(convertedText);
    };

    const handleCopyText = () => {
        const quillEditor = document.querySelector('.ql-editor');
        if (quillEditor) {
        const range = document.createRange();
        range.selectNodeContents(quillEditor);
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
        }
        }
    };

    const handleResetText = () => {
        setInputText('');
        setBionicText('');
        setIsFileMode(false);
        setFileInfo(null);
        setPdfText('');
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
            const buffer = e.target?.result as ArrayBuffer;
            if (file.type === 'application/pdf') {
                setPdfText('');
                setInputText('');
                setIsFileMode(true);
                setFileInfo({ name: file.name, type: file.type, size: file.size, file });
            } else {
                const text = new TextDecoder().decode(buffer);
                setInputText(text);
                const convertedText = convertToBionicReading(text, true);
                setBionicText(convertedText);
            }
            };
            reader.readAsArrayBuffer(file);
        }
    }

    const onDocumentLoadSuccess = async (pdf: any) => {
        setNumPages(pdf.numPages);
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          textContent.items.forEach((item: any) => {
            text += item.str + ' ';
          });
        }
        setPdfText(text);
      };

      const wordCount = inputText.split(/\s+/).filter((word) => word.length > 0).length;

  return (
    <Box className="min-h-screen bg-gray-50">
      <NavBar />

      <Box component="main" className="py-10">
        <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
            <Paper elevation={3} className="p-6">
              <Grid container spacing={2} justifyContent="left">
                <Grid item>
                  <Button variant="outlined" color='secondary' startIcon={<AttachFileIcon />}>
                    Convertir du texte
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color='primary' component="label" startIcon={<AttachFileIcon />}>
                    Importer un fichier
                    <input type="file" hidden onChange={handleFileUpload} />
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="secondary" onClick={handleResetText}>
                    Réinitialiser
                  </Button>
                </Grid>
              </Grid>
              <Grid container className="mt-4" alignItems="center" spacing={2} marginTop="8px">
                <Grid item xs={12} sm={isFileMode ? 10 : 5}>
                  {isFileMode && fileInfo ? (
                    <FileInfo name={fileInfo.name} type={fileInfo.type} size={fileInfo.size} file={fileInfo.file} />
                  ) : (
                    <TextField
                      label="Votre texte"
                      placeholder="Ecrivez ou collez votre texte ici."
                      multiline
                      rows={10}
                      variant="outlined"
                      fullWidth
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      helperText={`${wordCount}/300 mots`}
                    />
                  )}
                </Grid>
                {!isFileMode && (
                    <Grid item xs={12} sm={2} container justifyContent="center" alignItems="center">
                        <IconButton color="primary" onClick={handleConvertText}>
                            <SendIcon />
                        </IconButton>
                    </Grid>
                )}
                
                <Grid item xs={12} sm={isFileMode ? 10 : 5}>
                  <Box
                    component={Paper}
                    elevation={1}
                    className="p-4 relative"
                    sx={{ height: '263px', overflow: 'auto' }}
                  >
                    <ReactQuill
                      value={bionicText}
                      readOnly={true}
                      theme="snow"
                      modules={{ toolbar: false }}
                      style={{ height: 'calc(100% - 40px)', overflowY: 'auto' }} // Adjust height to fit the icon
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, position: 'absolute', bottom: 8, right: 8 }}>
                      <Tooltip title="Copier le texte">
                        <IconButton color="primary" onClick={handleCopyText}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Agrandir">
                        <IconButton color="primary" onClick={handleOpenModal}>
                          <ZoomInIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {isFileMode && fileInfo && (
            <Grid item xs={12} sm={10} md={8} className="mt-4">
              <Document file={fileInfo.file} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            </Grid>
          )}

          <Grid item xs={12} sm={10} md={8}>
            <Paper elevation={3} className="mt-10 p-6">
              <Typography variant="h3" component="h2" className="text-center">
                <b>Boo</b>stez <b>vo</b>tre <b>lec</b>ture <b>av</b>ec <b>l</b>a <b>lec</b>ture <b>bion</b>ique.
              </Typography>
              <Typography variant="body1" className="mt-4 text-center text-gray-600">
                Améliorez votre vitesse de lecture avec notre outil de conversion de texte en lecture bionique. Essayez gratuitement dès maintenant !
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={10} md={8}>
            <Grid container spacing={2} className="mt-10">
              <Grid item xs={12} md={6}>
                <Paper elevation={3} className="p-6">
                  <Typography variant="h5" component="h3" className="font-bold">Fonctionnalités</Typography>
                  <ul className="mt-2 space-y-2 text-gray-600">
                    <li><strong>Conversion Instantanée :</strong> Transformez vos textes en lecture bionique en un clic</li>
                    <li><strong>Compatibilité :</strong> Fonctionne avec les documents .pdf et .docx</li>
                    <li><strong>Sécurité :</strong> Vos textes sont protégés et ne sont jamais partagés</li>
                  </ul>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} className="p-6">
                  <Typography variant="h5" component="h3" className="font-bold">Avantages de la lecture bionique</Typography>
                  <ul className="mt-2 space-y-2 text-gray-600">
                    <li><strong>Vitesse de Lecture Accélérée :</strong> Lisez plus rapidement avec moins d'efforts</li>
                    <li><strong>Meilleure Compréhension :</strong> Augmentez votre rétention d'information</li>
                    <li><strong>Moins de Fatigue Visuelle :</strong> Lisez plus longtemps sans effort</li>
                    <li><strong>Adapté à Tous :</strong> Convient aux lecteurs dyslexiques et aux personnes ayant des troubles de l'attention</li>
                  </ul>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={10} md={8}>
            <Paper elevation={3} className="mt-10 p-6 bg-blue-900 text-white">
              <Typography variant="h5" component="h3" className="font-bold">Contactez-nous</Typography>
              <Typography variant="body1">Email: nathankiss0@gmail.com</Typography>
              <Grid container direction="column" spacing={1} className="mt-4">
                <Grid item>
                  <Link href="#" className="text-white">Ressources</Link>
                </Grid>
                <Grid item>
                  <Link href="#" className="text-white">Centre d'assistance</Link>
                </Grid>
                <Grid item>
                  <Link href="#" className="text-white">Blog</Link>
                </Grid>
                <Grid item>
                  <Link href="#" className="text-white">Documentation API</Link>
                </Grid>
                <Grid item>
                  <Link href="#" className="text-white">Accessibilité</Link>
                </Grid>
                <Grid item>
                  <Link href="#" className="text-white">Protection des données</Link>
                </Grid>
                <Grid item>
                  <Link href="#" className="text-white">Politique de confidentialité</Link>
                </Grid>
                <Grid item>
                  <Link href="#" className="text-white">Conditions générales</Link>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">
            Texte Converti
          </Typography>
          <ReactQuill
            value={bionicText}
            readOnly={true}
            theme="snow"
            modules={{ toolbar: false }}
            style={{ height: 'calc(100% - 40px)', overflowY: 'auto' }} // Adjust height to fit the icon
          />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, position: 'absolute', bottom: 8, right: 8 }}>
                <Tooltip title="Copier le texte">
                    <IconButton color="primary" onClick={handleCopyText}>
                        <ContentCopyIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;
