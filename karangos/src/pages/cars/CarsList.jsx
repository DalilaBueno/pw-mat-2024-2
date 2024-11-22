import Typography from '@mui/material/Typography';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { feedbackWait, feedbackNotify, feedbackConfirm } from '../../ui/Feedback';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function CarsList() {
  const columns = [
    {
      field: 'id',
      headerName: 'Cód.',
      type: 'number',
      width: 80,
    },
    {
      field: 'brand_model',
      headerName: 'Marca/Modelo',
      width: 200,
      renderCell: (params) => `${params.row.brand} / ${params.row.model}`,
    },
    {
      field: 'color',
      headerName: 'Cor do carro',
      width: 150,
    },
    {
      field: 'year_manufacture',
      headerName: 'Ano de fabricação',
      width: 150,
    },
    {
      field: 'imported',
      headerName: 'Importado?',
      width: 100,
      renderCell: (value) => (value.row.imported ? 'SIM' : ''),
    },
    {
      field: 'plates',
      headerName: 'Placa',
      width: 100,
    },
    {
      field: 'selling_date',
      headerName: 'Data de venda',
      width: 120,
      renderCell: (params) =>
        params.row.selling_date ? new Date(params.row.selling_date).toLocaleDateString('pt-BR') : '',
    },
    {
      field: 'selling_price',
      headerName: 'Preço de venda',
      width: 120,
      renderCell: (params) =>
        params.row.selling_price?.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
    },
    {
      field: '_edit',
      headerName: 'Editar',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 90,
      renderCell: (params) => (
        <Link to={`./${params.id}`}>
          <IconButton aria-label="Editar">
            <EditIcon />
          </IconButton>
        </Link>
      ),
    },
    {
      field: '_delete',
      headerName: 'Excluir',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 90,
      renderCell: (params) => (
        <IconButton
          aria-label="Excluir"
          onClick={() => handleDeleteButtonClick(params.id)}
        >
          <DeleteForeverIcon color="error" />
        </IconButton>
      ),
    },
  ];

  const [state, setState] = React.useState({
    Cars: [],
  });

  const { Cars } = state;

  React.useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    feedbackWait(true);
    try {
      const response = await fetch('https://api.faustocintra.com.br/v2/cars');
      const result = await response.json();

      setState({ ...state, Cars: result });
    } catch (error) {
      console.log(error);
      feedbackNotify('ERRO: ' + error.message, 'error');
    } finally {
      feedbackWait(false);
    }
  }

  async function handleDeleteButtonClick(id) {
    if (await feedbackConfirm('Deseja realmente excluir este item?')) {
      feedbackWait(true);
      try {
        await fetch(`https://api.faustocintra.com.br/v2/cars/${id}`, { method: 'DELETE' });

        loadData();

        feedbackNotify('Exclusão efetuada com sucesso.');
      } catch (error) {
        console.log(error);
        feedbackNotify('ERRO: ' + error.message, 'error');
      } finally {
        feedbackWait(false);
      }
    }
  }

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Listagem de veículos
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          mb: 2,
        }}
      >
        <Link to="./new">
          <Button
            variant="contained"
            size="large"
            color="secondary"
            startIcon={<AddCircleIcon />}
          >
            Novo veículo
          </Button>
        </Link>
      </Box>

      <Paper elevation={8} sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={Cars}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>
    </>
  );
}
