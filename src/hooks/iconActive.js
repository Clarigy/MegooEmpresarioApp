import $ from 'jquery';

function checkPath(id, path, url) {
  if (url === `${path}`) {
    $(`#${id}`).addClass('active');
  }
}

export default {
  checkPath,
};