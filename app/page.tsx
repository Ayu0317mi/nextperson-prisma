'use client'

import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Layout from '../app/layout';
/*import PersonTable from './components/PersonTable'
import PersonDialog from './components/PersonDialog';
import SnackbarAlert from './components/SnackbarAlert';*/
import { Person } from '../lib/person';

//these are required for the AppBar
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

//import my custom Footer that will go at the bottom of the page
/*import Footer from './components/CFooter';*/

const HomePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [open, setOpen] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch('/api/people');
        if (response.ok) {
          const data = await response.json();
          setPeople(data);
        } else {
          console.error('Error fetching people data.');
        }
      } catch (error) {
        console.error('Error fetching people data:', error);
      }
    };

    fetchPeople();
  }, []);

  const handleOpen = (person: Person | null) => {
    setCurrentPerson(person);
    setEditMode(!!person);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentPerson(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/people/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPeople(prevPeople => prevPeople.filter(person => person.id !== id));
        setSnackbarMessage('Record deleted successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Error deleting the record.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error deleting the person:', error);
      setSnackbarMessage('Error deleting the record.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleSubmit = async () => {
    if (currentPerson) {
      // Convert Date object to YYYY-MM-DD string
      const formattedDob = currentPerson.dob ? new Date(currentPerson.dob).toISOString().split('T')[0] : '';
      const personToSubmit = {
        ...currentPerson,
        dob: formattedDob,
      };

      console.log('Submitting person data:', personToSubmit); // Debugging statement

      try {
        let response;
        if (editMode && currentPerson) {
          console.log('Edit mode is true. Submitting update for person:', currentPerson); // Debugging statement
          response = await fetch(`/api/people/${currentPerson.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(personToSubmit),
          });
        } else {
          console.log('Edit mode is false. Creating new person:', currentPerson); // Debugging statement
          response = await fetch('/api/people', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(personToSubmit),
          });
        }

        if (response.ok) {
          const updatedPerson: Person = await response.json();
          console.log('Updated person from server:', updatedPerson); // Debugging statement

          // Format the dob to YYYY-MM-DD
          updatedPerson.dob = updatedPerson.dob ? updatedPerson.dob.split('T')[0] : '';
          console.log('Updated person with formatted dob:', updatedPerson); // Debugging statement

          if (editMode) {
            setPeople(prevPeople =>
              prevPeople.map(person => (person.id === updatedPerson.id ? updatedPerson : person))
            );
          } else {
            setPeople(prevPeople => [...prevPeople, updatedPerson]);
          }
          setSnackbarMessage('Record saved successfully!');
          setSnackbarSeverity('success');
        } else {
          console.error('Error response from server:', await response.text()); 
          setSnackbarMessage('Error saving the record.');
          setSnackbarSeverity('error');
        }
      } catch (error) {
        console.error('Error saving the person:', error);
        setSnackbarMessage('Error saving the record.');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
      handleClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (

    <Layout>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            People
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Add spacing below the AppBar */}
      <div style={{ marginTop: '50px' }}></div>

      <Container component="main" style={{ flex: 1, marginTop: '64px' }}>
        <Button variant="contained" onClick={() => handleOpen(null)}>Add New Person</Button>
      </Container>
   
    </Layout>
  );
};

export default HomePage;

