using Microsoft.AspNetCore.Mvc;

namespace Web.Application;

public abstract class BaseController : ControllerBase
{
    protected ActionResult<T> OkResult<T>(T value)
    {
        return this.Ok(value);
    }

    protected ActionResult<T?> OkResultNullable<T>(T? value)
        where T : class
    {
        return this.Ok(value);
    }
}