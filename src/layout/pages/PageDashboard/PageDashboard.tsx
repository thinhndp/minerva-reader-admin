import React, { FunctionComponent } from 'react';

import classes from './PageDashboard.module.scss';

const PageDashboard: FunctionComponent = () => {
  return (
    <div className={classes['page-container']}>
      {/* <div>TODO: Edit this</div> */}
      {/* <div className={classes['page-content']}>
        Welcome to Minerva Reader Dashboard
      </div> */}
      <img className={classes['logo']} src='https://firebasestorage.googleapis.com/v0/b/uit-lib.appspot.com/o/logo.png?alt=media&token=6ff67db9-dbfd-44b7-b94f-def1ced2a1bb' alt='minerva-logo'></img>
    </div>

  );
}

export default PageDashboard;