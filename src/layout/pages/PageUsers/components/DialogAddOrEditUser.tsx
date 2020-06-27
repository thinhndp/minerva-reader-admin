import React, { useState, FunctionComponent } from 'react';

// Misc
import * as userAPI from '../../../../api/userAPI';

// Interface
import { User, UserUpdateRoleInput } from '../../../../interfaces/user';

// Component
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormLabel from '@material-ui/core/FormLabel';

// Custom Component
import CheckboxGroup from '../../../../components/CheckboxGroup';

interface IDialogAddOrEditUserProps {
  userToEdit: User | null, // null: DialogAdd. not null: DialogEdit
  roleList: Array<String>,
  isOpen: boolean,
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddOrEditUser: FunctionComponent<IDialogAddOrEditUserProps> = (props) => {
  const [userInput, setUserInput] = useState<UserUpdateRoleInput>({ roles: [], usernames: [] });
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const onDialogEnter = () => {
    if (!props.userToEdit) {
      setUserInput({ roles: [], usernames: [] });
    } else {
      setUserInput({
        roles: props.userToEdit.roles,
        usernames: [ props.userToEdit.username ]
      });
    }
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const onDialogSave = () => {
    setIsLoadingSave(true);
    if (!props.userToEdit) {
      // // Add
      // userAPI.addUser(userInput)
      //   .then(response => {
      //     setIsLoadingSave(false);
      //     console.log(response);
      //     props.onSave();
      //   })
      //   .catch(err => {
      //     setIsLoadingSave(false);
      //     console.log(err);
      //   })
    } else {
      // Update
      // userAPI.updateUser(props.userToEdit.id, userInput)
      //   .then(response => {
      //     setIsLoadingSave(false);
      //     console.log(response);
      //     props.onSave();
      //   })
      //   .catch(err => {
      //     setIsLoadingSave(false);
      //     console.log(err);
      //   })
      console.log(userInput);
      userAPI.updateUserRole(userInput)
        .then(response => {
          setIsLoadingSave(false);
          console.log(response);
          props.onSave();
        })
        .catch(err => {
          setIsLoadingSave(false);
          console.log(err);
        })
    }
  }

  const onCheckChange = (newSelectedValues: any) => {
    // console.log(newSelectedValues);
    setUserInput({ ...userInput, roles: [ ...newSelectedValues ] })
  }

  return (
    <Dialog open={props.isOpen} onEnter={() => onDialogEnter()} onClose={() => onDialogClose()}>
      <DialogTitle id="form-dialog-title">{!props.userToEdit ? `Add User` : `Edit User: ${props.userToEdit.username}`}</DialogTitle>
      <DialogContent dividers>
        {/* <DialogContentText>
          Please fill those fields below to continue.
        </DialogContentText> */}
        <FormLabel>Roles:</FormLabel>
        <CheckboxGroup
          options={props.roleList.map(role => ({ role }))}
          fieldValue="role"
          fieldLabel="role"
          selectedValues={userInput.roles}
          onChange={(newSelectedValues: any) => { onCheckChange(newSelectedValues) }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onDialogClose()}
          // color="primary"
        >
          Cancel
        </Button>
        <div style={{position: 'relative'}}>
          {/* Extra <div> is for loading */}
          <Button onClick={() => onDialogSave()} color="primary" variant="contained" disabled={isLoadingSave}>
            Save
          </Button>
          {isLoadingSave ? <CircularProgress size={24} className="circular-center-size-24px" /> : null}
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default DialogAddOrEditUser;