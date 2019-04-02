function setResponse(ctx,status,body)
{
    ctx.status = status;
    ctx.body = body;
    return body;
}

module.exports = {
    setResponse,
}