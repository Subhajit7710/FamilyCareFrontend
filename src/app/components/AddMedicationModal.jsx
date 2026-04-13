import { useState } from 'react';
import { X, Search } from 'lucide-react';

export default function AddMedicationModal({ isOpen, onClose, patientName, onAdd }) {
  const [activeStep, setActiveStep] = useState(0);
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('once-daily');
  const [time, setTime] = useState('08:00');
  const [searchResults, setSearchResults] = useState([]);

  const steps = ['Medication', 'Dosage', 'Schedule', 'Review'];

  const handleSearch = (query) => {
    setMedicationName(query);
    
    // TODO: Connect to real drug search API
    // const results = await drugService.searchDrug(query);
    // setSearchResults(results);
    
    // Mock search results
    if (query.length > 2) {
      setSearchResults([
        { id: 1, name: 'Metformin', commonDosages: ['500mg', '850mg', '1000mg'] },
        { id: 2, name: 'Lisinopril', commonDosages: ['5mg', '10mg', '20mg'] },
        { id: 3, name: 'Aspirin', commonDosages: ['81mg', '325mg'] },
      ].filter(drug => drug.name.toLowerCase().includes(query.toLowerCase())));
    } else {
      setSearchResults([]);
    }
  };

  const handleSubmit = () => {
    const medication = {
      name: medicationName,
      dosage,
      frequency,
      time,
      status: 'Upcoming',
      statusColor: 'blue',
    };

    onAdd(medication);
    handleClose();
  };

  const handleClose = () => {
    setActiveStep(0);
    setMedicationName('');
    setDosage('');
    setFrequency('once-daily');
    setTime('08:00');
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Add Medication</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-gray-600 mb-4">for {patientName}</p>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index <= activeStep
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div
                  className={`flex-1 ml-2 text-xs font-medium ${
                    index <= activeStep ? 'text-teal-600' : 'text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < activeStep ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 0: Select Medication */}
          {activeStep === 0 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Search Medication
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={medicationName}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Type medication name..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {searchResults.length > 0 && (
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                  {searchResults.map((drug) => (
                    <button
                      key={drug.id}
                      onClick={() => {
                        setMedicationName(drug.name);
                        setSearchResults([]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium">{drug.name}</div>
                      <div className="text-sm text-gray-500">
                        Common dosages: {drug.commonDosages.join(', ')}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 1: Dosage */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Dosage for {medicationName}
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g., 500mg, 10ml, 2 tablets"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                autoFocus
              />

              <div className="grid grid-cols-3 gap-2">
                {['500mg', '10mg', '20mg', '50mg', '100mg', '1 tablet'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setDosage(preset)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="once-daily">Once daily</option>
                  <option value="twice-daily">Twice daily</option>
                  <option value="three-times-daily">Three times daily</option>
                  <option value="four-times-daily">Four times daily</option>
                  <option value="as-needed">As needed</option>
                  <option value="weekly">Once weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Medication:</span>
                  <span className="font-medium">{medicationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dosage:</span>
                  <span className="font-medium">{dosage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium">{frequency.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{time}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> This medication will be added to {patientName}'s schedule. They will receive reminders at the specified time.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (activeStep < steps.length - 1) {
                setActiveStep(activeStep + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={
              (activeStep === 0 && !medicationName) ||
              (activeStep === 1 && !dosage)
            }
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeStep < steps.length - 1 ? 'Next →' : 'Add Medication'}
          </button>
        </div>
      </div>
    </div>
  );
}
