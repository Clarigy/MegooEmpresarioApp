const options = {
  paginationSize: 5,
  pageStartIndex: 1,
  alwaysShowAllBtns: false, // Always show next and previous button
  withFirstAndLast: true, // Hide the going to First and Last page button
  hideSizePerPage: true, // Hide the sizePerPage dropdown always
  hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
  prePageText: 'Anterior',
  nextPageText: 'Siguiente',
  showTotal: false,
  // paginationTotalRenderer: customTotal,
  disablePageTitle: false,
  sizePerPageList: [
    {
      text: '10',
      value: 10
    },
    {
      text: '15',
      value: 15
    },
    {
      text: '20',
      value: 20
    }
  ] // A numeric array is also available. the purpose of above example is custom the text
};

export default {
  options
};
