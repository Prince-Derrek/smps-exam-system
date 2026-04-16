using System;
using System.Threading.Tasks;

namespace SMPS.Application.Services.Interfaces
{
    public interface ITicketService
    {
        // 1. The Dispatcher (Quickly adds the job to the Postgres queue)
        void EnqueueTicketGeneration(Guid bookingId);

        // 2. The Consumer (The heavy lifter that runs in the background)
        Task GenerateAndEmailTicketAsync(Guid bookingId);
    }
}