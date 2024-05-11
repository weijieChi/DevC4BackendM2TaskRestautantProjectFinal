// Example starter JavaScript for disabling form submissions if there are invalid fields
(function validation() {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach((form) => {
      form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        if (document.querySelector('#password').value !== document.querySelector('#confirmPassword').value) {
          alert('密碼欄位與確認密碼欄位不相符');
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
}());
