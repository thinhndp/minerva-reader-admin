import React, { useState, FunctionComponent } from 'react';

// Misc
import * as movieAPI from '../../../../api/movieAPI';
import moment from 'moment';

// Interface
import { MovieInsertInput } from '../../../../interfaces/movie';
// import { Rate } from '../../../../interfaces/rate';
import { ScreenType } from '../../../../interfaces/screenType';

// Component
import MomentUtils from '@date-io/moment';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';

// Custom Component
import CheckboxGroup from '../../../../components/CheckboxGroup';

interface IDialogAddMovieProps {
  isOpen: boolean,
  screenTypeList: ScreenType[],
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddMovie: FunctionComponent<IDialogAddMovieProps> = (props) => {
  const [movieInput, setMovieInput] = useState<MovieInsertInput>({ imdbID: '', actors: [], endAt: moment().add(1, 'hour').startOf('hour').toISOString(), screenTypeIds: [] });
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  console.log((movieInput.endAt).slice(0, -5));
  console.log(moment().add(1, 'hour').startOf('hour'));

  const onDialogEnter = () => {
    setMovieInput({ imdbID: '', actors: [], endAt: moment().add(1, 'hour').startOf('hour').toISOString(), screenTypeIds: [] });
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const onDialogSave = () => {
    setIsLoadingSave(true);
    movieAPI.addMovie(movieInput)
      .then(response => {
        setIsLoadingSave(false);
        console.log(response);
        props.onSave();
      })
      .catch(err => {
        setIsLoadingSave(false);
        console.log(err);
      });
  }

  const renderScreenTypeCheckboxes = () => {
    return (
      <FormGroup style={{marginLeft: 10, marginBottom: 20,}}>
        <FormLabel>Screen types:</FormLabel>
        <div style={{display: 'flex',}}>
          <CheckboxGroup
            options={props.screenTypeList}
            fieldValue="id"
            fieldLabel="name"
            selectedValues={movieInput.screenTypeIds}
            onChange={(newSelectedValues: any) => { setMovieInput({ ...movieInput, screenTypeIds: newSelectedValues }) }}
          />
        </div>
      </FormGroup>
    )
  }

  return (
    <Dialog open={props.isOpen} onEnter={() => onDialogEnter()} onClose={() => onDialogClose()}>
      <DialogTitle id="form-dialog-title">Add Movie</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Please fill those fields below to continue.
        </DialogContentText>
        <TextField
          required
          label="Imdb ID"
          style={{ margin: 10, marginBottom: 20, }}
          placeholder="tt7286456"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={movieInput.imdbID}
          onChange={(event) => {setMovieInput({...movieInput, imdbID: event.target.value })}}
        />
        {renderScreenTypeCheckboxes()}
        {/* <TextField
          required
          label="End at"
          type="date"
          style={{ margin: 10, marginBottom: 20, }}
          placeholder="2020-01-20"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={movieInput.endAt}
          onChange={(event) => {setMovieInput({...movieInput, endAt: event.target.value })}}
        /> */}
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DateTimePicker
            required
            label="End at"
            inputVariant="outlined"
            style={{ margin: 10, marginBottom: 20 }}
            fullWidth
            minDate={moment()}
            minutesStep={5}
            value={movieInput.endAt}
            onChange={(date) => {
              if (date) {
                setMovieInput({...movieInput, endAt: date.toISOString()});
              }
            }}
          />
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onDialogClose()} color="primary">
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

export default DialogAddMovie;