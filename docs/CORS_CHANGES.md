# CORS Configuration Changes

## Problem
The frontend and backend were not working together because the frontend (running on localhost:3000) was unable to make requests to the backend API (running on localhost:5137) due to Cross-Origin Resource Sharing (CORS) restrictions. The backend did not have CORS policies configured, blocking cross-origin requests.

## Solution
Added CORS middleware to the ASP.NET Core backend to allow requests from any origin.

### Changes Made
1. **Added CORS Service Configuration** in `Program.cs`:
   ```csharp
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowAll", builder =>
       {
           builder.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
       });
   });
   ```

2. **Enabled CORS in the Request Pipeline** in `Program.cs`:
   ```csharp
   app.UseCors("AllowAll");
   ```
   This was placed before `app.UseAuthentication()` and `app.UseAuthorization()`.

## Impact
- Frontend can now successfully make API calls to the backend.
- For production, consider restricting the CORS policy to specific origins for security.

## Files Modified
- `backend/SMPS.SupplementaryExamSystem/SMPS.API/Program.cs`