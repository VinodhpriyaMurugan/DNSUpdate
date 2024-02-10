import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "center",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const ErrorToastAlert = (title) => {
  return Toast.fire({
    icon: "error",
    title,
  });
};

const SuccessToastAlert = (title) => {
  return Toast.fire({
    icon: "success",
    title,
  });
};

const InfoToastAlert = (title) => {
  return Toast.fire({
    icon: "info",
    title,
  });
};
/**
 *
 * @param {*} title Title to show on the confirmation
 * @param {*} confirmButtonText Text for display on the Success button
 * @param {*} denyButtonText  Text for display on the Deny button
 * @param {*} successCallBack CallBack for once the Success button Clicked
 * @param {*} errorCallBack CallBack for once the Cancel button Clicked
 * @returns
 */
const ConfirmationAlert = (
  title,
  subTitle,
  confirmButtonText,
  denyButtonText,
  successCallBack,
  errorCallBack
) => {
  return Swal.fire({
    title: title,
    text: subTitle,
    // showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    denyButtonText: denyButtonText,
  }).then(async function (result) {
    if (result.isConfirmed) {
      successCallBack();
    } else {
      errorCallBack();
    }
  });
};
export {
  ErrorToastAlert,
  SuccessToastAlert,
  InfoToastAlert,
  ConfirmationAlert,
};
