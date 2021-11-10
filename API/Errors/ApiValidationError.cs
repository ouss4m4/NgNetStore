namespace API.Errors
{
    public class ApiValidationError : ApiResponse
    {
        public ApiValidationError() : base(400)
        {

        }

        public IEnumerable<string> Errors { get; set; }
    }
}