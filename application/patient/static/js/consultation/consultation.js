$(function () {
  $(".generate-pdf-btn").on("click", function () {
    let pdfLink = $(this).attr("data-pdf-link");

    window.open(
      `${ABSOLUTE_BASE_URL}/emr/prescription/${pdfLink}`,
      (target = "_blank")
    );
  });
});
