import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import './DocumentControls.scss';
import getPagesToPrint from 'helpers/getPagesToPrint';
import { saveAs } from 'file-saver';

function getPageString(selectedPageArray, pageLabels) {
  let pagesToPrint = '';
  const sortedPages = selectedPageArray.sort((a, b) =>  a - b );
  let prevIndex = null;

  for (let i=0; sortedPages.length > i; i++) {
    if (sortedPages[i + 1] === sortedPages[i] + 1) {
      prevIndex = prevIndex !== null ? prevIndex : sortedPages[i];
    } else if (prevIndex !== null) {
      pagesToPrint = `${pagesToPrint}${pageLabels[prevIndex]}-${pageLabels[sortedPages[i]]}, `;
      prevIndex = null;
    } else {
      pagesToPrint = `${pagesToPrint}${pageLabels[sortedPages[i]]}, `;
    }
  }

  return pagesToPrint.slice(0, -2);
}

const DocumentControls = props => {
  const {
    deletePagesCallBack,
    selectedPageCount,
    selectedPageIndexes,
    pageLabels,
    updateSelectedPage,
  } = props;

  const initalPagesString = getPageString(selectedPageIndexes, pageLabels);

  // TODO figure out why the inital values is incorrect
  const [pageString, setPageString] = useState(initalPagesString);
  const [previousPageString, setPreviousPageString] = useState(initalPagesString);

  useEffect(() => {
    setPageString(getPageString(selectedPageIndexes, pageLabels));
  }, [selectedPageCount]);


  const deletePages = () => {
    deletePagesCallBack();
  };

  const extractPages = () => {
    window.readerControl.extractPages(selectedPageIndexes.map(index => index + 1 )).then(file => {
      saveAs(file, 'extractedDocument.pdf');
    });
  };

  const onBlur = e => {
    let selectedPagesString = e.target.value.replace(/ /g, '');

    // TODO move "getPagesToPrint" to another API
    let pages = !selectedPagesString ? [] : getPagesToPrint(selectedPagesString, pageLabels);
    let pageIndexes = pages.map(page => page - 1);

    if (pages.length || !selectedPagesString) {
      updateSelectedPage(pageIndexes);

      const updatedString = getPageString(selectedPageIndexes, pageLabels);

      setPageString(updatedString);
      setPreviousPageString(updatedString);
    } else {
      setPageString(previousPageString);   
    }
  };

  const pageStringUpdate = e => {
    setPageString(e.target.value);
  };

  // ${!selectedPageCount ? 'hidden' : ''}
  return (
    <div className={`documentControls `}>
      <div>
        <input 
          onBlur={onBlur}
          onChange={pageStringUpdate}
          value={pageString}
          placeholder={'Enter pages to select i.e. 2, 5-9'}
          className="pagesInput" type="text" />
      </div>
      <div className="documentControlsButton">
        <Button
          img="ic_delete_black_24px"
          onClick={deletePages}
          title="option.thumbnailPanel.delete"
        />
        <Button
          img="ic_extract_black_24px"
          title="action.extract"
          onClick={extractPages}
        />
      </div>
    </div>
  );
}

DocumentControls.propTypes = {
  deletePagesCallBack:  PropTypes.func.isRequired,
  selectedPageCount:  PropTypes.number,
  selectedPageIndexes: PropTypes.arrayOf(PropTypes.number),
  pageLabels: PropTypes.arrayOf(PropTypes.string),
  updateSelectedPage: PropTypes.func,
};

export default DocumentControls;