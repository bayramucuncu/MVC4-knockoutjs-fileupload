using System.Web.Mvc;

namespace FileUpload_MVC4.Controllers
{
    public class FileController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Upload()
        {
            return Json(new { message = "file upload is OK." }, JsonRequestBehavior.AllowGet);
        }
    }
}
