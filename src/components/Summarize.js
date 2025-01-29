// Summarize.js
import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Select, MenuItem, InputLabel, FormControl, Typography, Grid } from '@mui/material';

function Summarize() {
    const [emotion, setEmotion] = useState('');
    const [formality, setFormality] = useState('');
    const [inputText, setInputText] = useState('');
    const [tokenLimit, setTokenLimit] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const backendURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    // Handle changes for dropdowns and input fields
    const handleEmotionChange = (event) => setEmotion(event.target.value);
    const handleFormalityChange = (event) => setFormality(event.target.value);
    const handleTextChange = (event) => setInputText(event.target.value);
    const handleTokenLimitChange = (event) => setTokenLimit(event.target.value);

    const handleSubmit = async () => {
      setLoading(true);
      setResult("");
  
      try {
          const response = await fetch(
              `${backendURL}/summarizeWithOllama`,{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  // Add any necessary headers like authentication tokens
                },
                body: JSON.stringify({
                  inputText,
                  emotion,
                  formality,
                  tokenLimit,
                }),
              }
          );
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let done = false;
          let chunks = '';
  
          while (!done) {
              const { value, done: readerDone } = await reader.read();
              done = readerDone;
              

              try {
                if(!done){
                  chunks += JSON.parse(decoder.decode(value, { stream: true })).response;
                  setResult(chunks);
                }
              } catch (e) {
                  // If parsing fails, we continue accumulating the chunks
                  setResult("Oops! Something went wrong");
                  console.log(e);
              }
          }
  
      } catch (error) {
          console.error("Error during API request:", error);
          setResult("An error occurred while processing your request.");
      } finally {
          setLoading(false);
      }
  };
  


    return (
        <Box
            className="container"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 3,
                maxWidth: 800,
                margin: 'auto',
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 3,
                paddingTop: 4,
                marginTop: 8
            }}
        >
            <Typography variant="h4" gutterBottom>
                Text Summarizer
            </Typography>

            <TextField
                label="Enter Text"
                variant="outlined"
                multiline
                fullWidth
                rows={6} // Initial height of the textarea
                value={inputText}
                onChange={handleTextChange}
                sx={{ marginBottom: 2, width: '100%' }}
            />

            {/* Grid container for dropdowns */}
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Emotion</InputLabel>
                        <Select value={emotion} label="Emotion" onChange={handleEmotionChange}>
                            <MenuItem value="happy">Happy</MenuItem>
                            <MenuItem value="sad">Sad</MenuItem>
                            <MenuItem value="neutral">Neutral</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Formality</InputLabel>
                        <Select value={formality} label="Formality" onChange={handleFormalityChange}>
                            <MenuItem value="formal">Formal</MenuItem>
                            <MenuItem value="informal">Informal</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Token Limit</InputLabel>
                        <Select value={tokenLimit} label="Token Limit" onChange={handleTokenLimitChange}>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={1000}>1000</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ marginTop: 2 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit'}
            </Button>

            {result && (
                <Box
                    className="result-box"
                    sx={{
                        marginTop: 2,
                        padding: 2,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        boxShadow: 1,
                    }}
                >
                    <Typography variant="body1">{result}</Typography>
                </Box>
            )}
        </Box>
    );
}

export default Summarize;
