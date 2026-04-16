import React, { useState } from 'react';
import UnitSelectionStep from './components/UnitSelectionStep';
import PaymentStep from './components/PaymentStep';
import ConfirmationStep from './components/ConfirmationStep';
import { createPendingBooking } from '../../services/bookingService';

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleUnitSelect = async (unit) => {
    setError('');
    setIsCreating(true);
    try {
      // 1. Create the Pending Booking in the DB
      const response = await createPendingBooking(unit.id);
      
      // 2. Save state and move to payment
      setSelectedUnit(unit);
      setBookingId(response.bookingId);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking.");
    } finally {
      setIsCreating(false);
    }
  };

  const handlePaymentSuccess = (result) => {
    setPaymentResult(result);
    setStep(3);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
      
      {isCreating && step === 1 && (
        <div className="text-center text-sm font-semibold text-primary">Securing your unit...</div>
      )}

      {!isCreating && step === 1 && <UnitSelectionStep onSelect={handleUnitSelect} />}
      
      {step === 2 && (
        <PaymentStep 
          unit={selectedUnit} 
          bookingId={bookingId} 
          onPaymentSuccess={handlePaymentSuccess} 
          onBack={() => setStep(1)} 
        />
      )}
      
      {step === 3 && (
        <ConfirmationStep 
          unit={selectedUnit} 
          receiptNumber={paymentResult.receiptNumber} 
          ticketId={paymentResult.ticketId} 
          onBookAnother={() => { setStep(1); setSelectedUnit(null); }} 
        />
      )}
    </div>
  );
}