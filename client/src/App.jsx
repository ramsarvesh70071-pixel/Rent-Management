import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ReceiptForm from './components/ReceiptForm';
import SingleReceiptView from './components/SingleReceiptView';
import PrintableReceiptSheet from './components/PrintableReceiptSheet';
import ReceiptPreviewModal from './components/ReceiptPreviewModal';
import CustomerList from './components/CustomerList';
import CustomerModal from './components/CustomerModal';
import ReceiptHistory from './components/ReceiptHistory';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';
import { api } from './api/api';
import { numberToWords } from './utils/numberToWords';
import { getTodayISODate, getCurrentMonthYear } from './utils/formatDate';

export default function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [customers, setCustomers] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Active form data - starts clean and blank until a customer is selected
  const [formData, setFormData] = useState({
    receiptNumber: '',
    receiptDate: getTodayISODate(),
    rentMonth: getCurrentMonthYear(),
    amount: '',
    amountInWords: '',
    shopNumber: '',
    propertyName: '',
    propertyAddress: '',
    ownerName: 'SRI KIRTI AGRAWAL',
    ownerFatherName: 'LATE SRI SATYA PRAKASH AGRAWAL',
    customerId: '',
    customerName: '',
    customerFatherName: '',
  });

  // Modal states
  const [previewReceipt, setPreviewReceipt] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Helper to show toasts
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Initial data loading
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [customersData, receiptsData, settingsData, nextNumData] = await Promise.all([
        api.getCustomers(),
        api.getReceipts(),
        api.getSettings(),
        api.getNextReceiptNumber().catch(() => ({ formattedReceiptNumber: '00015' })),
      ]);

      setCustomers(customersData || []);
      setReceipts(receiptsData || []);
      setSettings(settingsData || null);

      if (settingsData) {
        const props = settingsData.properties || [];
        const defaultProp = props.find((p) => p.isDefault) || props[0] || null;
        setSelectedProperty(defaultProp);

        setFormData((prev) => ({
          ...prev,
          receiptNumber: nextNumData?.formattedReceiptNumber || prev.receiptNumber,
          propertyName: defaultProp?.name || '',
          ownerName: defaultProp?.ownerName || settingsData.ownerName || prev.ownerName,
          ownerFatherName: defaultProp?.ownerFatherName || settingsData.ownerFatherName || prev.ownerFatherName,
          propertyAddress: defaultProp?.address || settingsData.propertyAddress || prev.propertyAddress,
          shopNumber: defaultProp?.defaultShopNumber || settingsData.defaultShopNumber || 'Second floor portion',
          customerId: '',
          customerName: '',
          amount: '',
          amountInWords: '',
        }));
      }
    } catch (err) {
      console.error('Initialization error:', err);
      showToast('Could not load some data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Fetch next receipt number when needed
  const refreshNextNumber = async () => {
    try {
      const data = await api.getNextReceiptNumber();
      if (data?.formattedReceiptNumber) {
        setFormData((prev) => ({ ...prev, receiptNumber: data.formattedReceiptNumber }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Switch selected property
  const handleSelectProperty = (prop) => {
    if (!prop) return;
    setSelectedProperty(prop);
    setFormData((prev) => ({
      ...prev,
      propertyName: prop.name || '',
      propertyAddress: prop.address || prev.propertyAddress,
      shopNumber: prop.defaultShopNumber || prev.shopNumber,
      ownerName: prop.ownerName || settings?.ownerName || prev.ownerName,
      ownerFatherName: prop.ownerFatherName || settings?.ownerFatherName || prev.ownerFatherName,
    }));
    showToast(`Filtered property: ${prop.name}`, 'info');
  };

  // Reset form for a fresh receipt
  const handleNewReceipt = async () => {
    setActiveTab('generate');
    try {
      const nextData = await api.getNextReceiptNumber();
      const currentP =
        selectedProperty ||
        (settings?.properties?.find((p) => p.isDefault)) ||
        settings?.properties?.[0];

      setFormData((prev) => ({
        ...prev,
        receiptNumber: nextData?.formattedReceiptNumber || prev.receiptNumber,
        receiptDate: getTodayISODate(),
        rentMonth: getCurrentMonthYear(),
        amount: '',
        amountInWords: '',
        customerId: '',
        customerName: '',
        customerFatherName: '',
        propertyName: currentP?.name || '',
        shopNumber: currentP?.defaultShopNumber || settings?.defaultShopNumber || 'Second floor portion',
        propertyAddress: currentP?.address || settings?.propertyAddress || 'BUXIPUR  SHER KOTHI, GORAKHPUR',
        ownerName: currentP?.ownerName || settings?.ownerName || 'SRI KIRTI AGRAWAL',
        ownerFatherName: currentP?.ownerFatherName || settings?.ownerFatherName || 'LATE SRI SATYA PRAKASH AGRAWAL',
      }));
      showToast('Form reset for new receipt generation', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  // Preview Action
  const handlePreview = () => {
    if (!formData.customerName.trim()) {
      showToast('Please enter or select a customer name', 'error');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast('Please enter a valid rent amount', 'error');
      return;
    }
    setPreviewReceipt({ ...formData });
    setIsPreviewOpen(true);
  };

  // Save to DB and trigger Print
  const handleSaveAndPrint = async () => {
    if (!formData.customerName.trim()) {
      showToast('Please enter or select a customer name', 'error');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast('Please enter a valid rent amount', 'error');
      return;
    }

    try {
      setLoading(true);
      // Save receipt to DB
      const created = await api.createReceipt({
        ...formData,
        customReceiptNumber: formData.receiptNumber,
      });

      // Update receipts list and state
      setReceipts((prev) => [created, ...prev]);
      setPreviewReceipt(created);
      showToast(`Receipt #${created.receiptNumber} saved successfully!`, 'success');

      // Refresh next receipt number for upcoming receipts
      await refreshNextNumber();

      // Trigger native print
      setTimeout(() => {
        window.print();
      }, 300);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to save receipt', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Save only without printing
  const handleSaveOnly = async () => {
    if (!formData.customerName.trim()) {
      showToast('Please enter or select a customer name', 'error');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast('Please enter a valid rent amount', 'error');
      return;
    }

    try {
      setLoading(true);
      const created = await api.createReceipt({
        ...formData,
        customReceiptNumber: formData.receiptNumber,
      });

      setReceipts((prev) => [created, ...prev]);
      showToast(`Receipt #${created.receiptNumber} recorded in history!`, 'success');
      await refreshNextNumber();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to save receipt', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Direct print from preview modal
  const handlePrintFromModal = () => {
    window.print();
  };

  // View existing receipt from history
  const handleViewReceipt = (receipt) => {
    setPreviewReceipt(receipt);
    setIsPreviewOpen(true);
  };

  // Reprint existing receipt from history
  const handlePrintReceipt = (receipt) => {
    setPreviewReceipt(receipt);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Delete receipt from history
  const handleDeleteReceipt = async (id, number) => {
    if (!window.confirm(`Are you sure you want to delete receipt #${number}?`)) return;
    try {
      await api.deleteReceipt(id);
      setReceipts((prev) => prev.filter((r) => r._id !== id));
      showToast(`Receipt #${number} deleted`, 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete receipt', 'error');
    }
  };

  // Customer Management Handlers
  const handleSaveCustomer = async (custData) => {
    try {
      setLoading(true);
      if (editingCustomer) {
        const updated = await api.updateCustomer(editingCustomer._id, custData);
        setCustomers((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
        showToast(`Customer "${updated.name}" updated`, 'success');
      } else {
        const created = await api.createCustomer(custData);
        setCustomers((prev) => [...prev, created]);
        showToast(`Customer "${created.name}" created`, 'success');
      }
      setIsCustomerModalOpen(false);
      setEditingCustomer(null);
    } catch (err) {
      showToast(err.message || 'Failed to save customer', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      showToast(`Customer "${name}" deleted`, 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete customer', 'error');
    }
  };

  // Select customer from directory and transition to generate receipt tab
  const handleSelectCustomerForReceipt = (cust) => {
    // Check if customer is assigned to a specific property
    const matchingProp = cust.propertyName && settings?.properties
      ? settings.properties.find(
          (p) => p.name.toUpperCase() === cust.propertyName.toUpperCase()
        )
      : null;

    const activeProp = matchingProp || selectedProperty || settings?.properties?.[0];

    setFormData((prev) => ({
      ...prev,
      customerId: cust._id,
      customerName: cust.name,
      customerFatherName: cust.fatherName || '',
      propertyName: activeProp ? activeProp.name : (cust.propertyName || prev.propertyName),
      propertyAddress: activeProp ? activeProp.address : prev.propertyAddress,
      ownerName: activeProp?.ownerName || prev.ownerName,
      ownerFatherName: activeProp?.ownerFatherName || prev.ownerFatherName,
      shopNumber: cust.defaultShopNumber || activeProp?.defaultShopNumber || prev.shopNumber || 'Second floor portion',
      amount: cust.defaultAmount ? String(cust.defaultAmount) : prev.amount,
      amountInWords: cust.defaultAmount ? numberToWords(cust.defaultAmount) : prev.amountInWords,
    }));

    if (matchingProp) {
      setSelectedProperty(matchingProp);
    }

    setActiveTab('generate');
    showToast(`Loaded "${cust.name}" into receipt generator`, 'info');
  };

  // Settings Save Handler
  const handleSaveSettings = async (settingsData) => {
    try {
      setLoading(true);
      const updated = await api.updateSettings(settingsData);
      setSettings(updated);

      const updatedProps = updated.properties || [];
      const newDefault = updatedProps.find((p) => p.isDefault) || updatedProps[0] || null;
      setSelectedProperty(newDefault);

      setFormData((prev) => ({
        ...prev,
        propertyName: newDefault?.name || '',
        ownerName: newDefault?.ownerName || updated.ownerName || prev.ownerName,
        ownerFatherName: newDefault?.ownerFatherName || updated.ownerFatherName || prev.ownerFatherName,
        propertyAddress: newDefault?.address || updated.propertyAddress || prev.propertyAddress,
        shopNumber: newDefault?.defaultShopNumber || updated.defaultShopNumber || prev.shopNumber,
      }));

      await refreshNextNumber();
      showToast('All owner & property settings saved successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customerCount={customers.length}
        receiptCount={receipts.length}
        onNewReceipt={handleNewReceipt}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print">
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <ReceiptForm
                formData={formData}
                setFormData={setFormData}
                customers={customers}
                settings={settings}
                selectedProperty={selectedProperty}
                onSelectProperty={handleSelectProperty}
                onPreview={handlePreview}
                onSaveAndPrint={handleSaveAndPrint}
                onSaveOnly={handleSaveOnly}
                onOpenCustomerModal={() => {
                  setEditingCustomer(null);
                  setIsCustomerModalOpen(true);
                }}
                onNavigateToSettings={() => setActiveTab('settings')}
                loading={loading}
              />
            </div>

            {/* Quick Live Preview Column: Single Receipt View */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Live Receipt Preview (Single View)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="text-xs text-stone-600 hover:text-black font-semibold underline cursor-pointer"
                  >
                    Expand / A4 Double View
                  </button>
                </div>

                {/* Render live single receipt view */}
                <div className="border border-stone-200 rounded p-2 bg-stone-50 overflow-x-auto">
                  <div className="scale-95 origin-top">
                    <SingleReceiptView receipt={formData} type="owner" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <CustomerList
            customers={customers}
            properties={settings?.properties || []}
            onAddCustomer={() => {
              setEditingCustomer(null);
              setIsCustomerModalOpen(true);
            }}
            onEditCustomer={(cust) => {
              setEditingCustomer(cust);
              setIsCustomerModalOpen(true);
            }}
            onDeleteCustomer={handleDeleteCustomer}
            onSelectCustomerForReceipt={handleSelectCustomerForReceipt}
            loading={loading}
          />
        )}

        {activeTab === 'history' && (
          <ReceiptHistory
            receipts={receipts}
            properties={settings?.properties || []}
            onViewReceipt={handleViewReceipt}
            onPrintReceipt={handlePrintReceipt}
            onDeleteReceipt={handleDeleteReceipt}
            loading={loading}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsModal
            settings={settings}
            onSaveSettings={handleSaveSettings}
            loading={loading}
          />
        )}
      </main>

      {/* Hidden container dedicated to Native Browser Print (@media print) */}
      <PrintableReceiptSheet
        receipt={previewReceipt || formData}
        isPrintOnly={true}
      />

      {/* Preview Modal */}
      <ReceiptPreviewModal
        receipt={previewReceipt || formData}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onPrint={handlePrintFromModal}
        onEdit={() => {
          setIsPreviewOpen(false);
          setActiveTab('generate');
        }}
      />

      {/* Add / Edit Customer Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
        initialData={editingCustomer}
        properties={settings?.properties || []}
        loading={loading}
      />

      {/* Toast notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
