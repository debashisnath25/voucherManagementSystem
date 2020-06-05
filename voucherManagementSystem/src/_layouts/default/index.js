import React from "react";
import PropTypes from "prop-types";
import 'react-bootstrap';

export default function DefaultLayout({ children }) {
  return(
    <>
      <div className="page-wrapper">
        <div className="content-wrapper">
            <div className="content-area">
                <div>{children}</div>
            </div>
        </div>
      </div>
    </>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.element.isRequired
};
