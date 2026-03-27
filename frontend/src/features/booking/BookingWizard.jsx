import React, { useState } from 'react';
import { Check } from 'lucide-react';
import UnitSelectionStep from './components/UnitSelectionStep';
import PaymentStep from './components/PaymentStep';
import ConfirmationStep from './components/ConfirmationStep';

const STEPS = [
  { id: 1, label: 'Select Unit' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Confirmation' },
];

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, idx) => {
        const isDone = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-blue-600 text-white'
                    : isActive
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : step.id}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium hidden sm:block ${
                  isActive ? 'text-blue-600' : isDone ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 mb-5 sm:mb-0 transition-colors ${
                  step.id < currentStep ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    setStep(2);
  };

  const handlePaymentSuccess = (result) => {
    setPaymentResult(result);
    setStep(3);
  };

  const handleBookAnother = () => {
    setStep(1);
    setSelectedUnit(null);
    setPaymentResult(null);
  };

  return (
    <div>
      <StepIndicator currentStep={step} />

      {step === 1 && <UnitSelectionStep onSelect={handleUnitSelect} />}
      {step === 2 && selectedUnit && (
        <PaymentStep
          unit={selectedUnit}
          onPaymentSuccess={handlePaymentSuccess}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && selectedUnit && paymentResult && (
        <ConfirmationStep
          unit={selectedUnit}
          receiptNumber={paymentResult.receiptNumber}
          ticketId={paymentResult.ticketId}
          onBookAnother={handleBookAnother}
        />
      )}
    </div>
  );
}
