import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as authorAPI from '../../../api/authorAPI';

// Interface
import { Author } from '../../../interfaces/author';

// Component
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import MaterialTable, { Column, MTableAction } from 'material-table';

// Custom Component
import DialogAddOrEditAuthor from './components/DialogAddOrEditAuthor';
import ModalAddOrEditAuthor from './components/ModalAddOrEditAuthor';
import DialogYesNo from '../../../components/DialogYesNo';

const NO_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

const PageAuthors: FunctionComponent = () => {
  const [authors, setAuthors] = useState<Array<Author>>([]);
  const [authorToEdit, setAuthorToEdit] = useState<Author | null>(null);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isDialogAddOrEditOpen, setIsDialogAddOrEditOpen] = useState(false);
  // Delete Dialog
  const [authorIdToDelete, setAuthorIdToDelete] = useState('');
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  
  const columns: Array<Column<Author>> = [
	{ title: 'Id', field: 'id', editable: 'never', cellStyle: {width: '300px'} },
	{ title: 'Name', field: 'name' },
	{ title: 'About', field: 'about' },
	{
		title: 'PhotoURL',
		field: 'PhotoURL',
		render: (rowData) => {
			return (
				<span>
					<img
						src={rowData.PhotoURL ? rowData.PhotoURL : NO_IMAGE_URL}
						alt={`${rowData.name}`}
						style={{ width: 100, height: 'auto' }}
					/>
				</span>
			);
		}
	},
  ]

  useEffect(() => {
	getAllAuthors();
  }, []);

  const getAllAuthors = () => {
	setIsTableLoading(true);
	authorAPI.getAllAuthors()
	  .then(response => {
		setIsTableLoading(false);
		setAuthors(response.data.authors);
	  })
	  .catch(err => {
		setIsTableLoading(false);
	  })
  }

  const onAddClick = () => {
	setIsDialogAddOrEditOpen(true);
  }

  const onUpdateClick = (event: any, author: any) => {
	setAuthorToEdit(author);
	setIsDialogAddOrEditOpen(true);
  }
  
  const onDeleteClick = (event: any, author: any) => {
	setAuthorIdToDelete(author.id);
	setIsDialogDeleteOpen(true);
  }
  
  const deleteAuthor = (id: string) => {
	setIsLoadingDelete(true);
	authorAPI.deleteAuthor(id)
	  .then((response) => {
		setIsLoadingDelete(false);
		closeDialogDelete();
		getAllAuthors();
	  })
	  .catch((err) => {
		setIsLoadingDelete(false);
		console.log(err);
	  })
  }
  
  const closeDialogDelete = () => {
	setAuthorIdToDelete('');
	setIsDialogDeleteOpen(false);
  }

  return (
	<div>
	  <MaterialTable
		title="Authors"
		isLoading={isTableLoading}
		columns={columns}
		data={authors}
		options={{
		  headerStyle: {
			backgroundColor: '#009be5',
			color: '#fff',
		  },
		  rowStyle: {
			backgroundColor: '#eee',
		  },
		}}
		actions={[
		  { icon: 'edit', tooltip: 'Edit', onClick: (event, rowData) => onUpdateClick(event, rowData) },
		  { icon: 'delete', tooltip: 'Delete', onClick: (event, rowData) => onDeleteClick(event, rowData) },
		  { icon: 'add', tooltip: 'Add', onClick: () => {}, isFreeAction: true }, // Will be overrided right below
		]}
		components={{
		  Action: prevProps => {
			if (prevProps.action.icon === 'add') {
			  // Override 'add' Action
			  return <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{marginLeft: '20px'}} onClick={() => onAddClick()}>Add Author</Button>;
			}

			return <MTableAction {...prevProps} />
		  }
		}}
	  />

	  {/* <DialogAddOrEditAuthor
		authorToEdit={authorToEdit}
		isOpen={isDialogAddOrEditOpen}
		onClose={() => {
		  setIsDialogAddOrEditOpen(false);
		  // setTimeout temp fix: transition (animation) doesn't catch up on setGenreToEdit(null)
		  // TODO: Fix this
		  setTimeout(() => {
			setAuthorToEdit(null);
		  }, 150);
		}}
		onSave={() => {
		  setIsDialogAddOrEditOpen(false);
		  // setTimeout temp fix: transition (animation) doesn't catch up on setGenreToEdit(null)
		  // TODO: Fix this
		  setTimeout(() => {
			setAuthorToEdit(null);
		  }, 150);

		  getAllAuthors();
		}}
	  /> */}
	  <ModalAddOrEditAuthor
		authorToEdit={authorToEdit}
		isOpen={isDialogAddOrEditOpen}
		onClose={() => {
		  setIsDialogAddOrEditOpen(false);
		  setTimeout(() => {
			setAuthorToEdit(null);
		  }, 150);
		}}
		onSave={() => {
		  setIsDialogAddOrEditOpen(false);
		  setTimeout(() => {
			setAuthorToEdit(null);
		  }, 150);
		  getAllAuthors();
		}}
	  />

	  
	  <DialogYesNo
		isOpen={isDialogDeleteOpen}
		isLoadingYes={isLoadingDelete}
		onYes={() => {deleteAuthor(authorIdToDelete);}}
		onNo={() => {closeDialogDelete();}}
		onClose={() => {closeDialogDelete();}}
	  />
	</div>
  );
}

export default PageAuthors;