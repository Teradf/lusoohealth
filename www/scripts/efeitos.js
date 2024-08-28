window.onload = function () {
    const addButton = document.getElementById('add');

    function limitLength(element, maxLength) {
        if (element.value.length > maxLength) {
          element.value = element.value.slice(0, maxLength);
        }
      }
}