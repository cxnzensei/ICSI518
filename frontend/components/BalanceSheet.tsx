// SOME PARTS HAVE BEEN ADAPTED FROM CHATGPT

import React, { useState } from 'react';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import LineItemForm from './LineItemForm';
import { Button } from "@/components/ui/button"



type BalanceItem = {
    name: string;
    value: number;
    assetType?: string;  // Only relevant for assets
}

const assetTypes = ['Fixed Assets', 'Investments', 'Land/Buildings']

// Balance Sheet Component
const BalanceSheet: React.FC = () => {
  const [assets, setAssets] = useState<BalanceItem[]>([]);
  const [liabilities, setLiabilities] = useState<BalanceItem[]>([]);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<BalanceItem>({ name: '', value: 0, assetType: '' });
  const [formType, setFormType] = useState<'asset' | 'liability' | ''>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const getAssetsByType = ({type} : {type : string}) => assets.filter(asset => asset.assetType === type);



  const openForm = (type: 'asset' | 'liability', index: number | null = null, item: BalanceItem | null = null) => {
    setFormType(type);
    setEditIndex(index);
    if (item) {
      setFormData(item);
    } else {
      setFormData({ name: '', value: 0, assetType: '' });
    }
    setFormVisible(true);
  }

  // Close the form
  const closeForm = () => {
    setFormVisible(false);
  }

   // Handle form submission for adding or editing items
   const handleFormSubmit = (newItem: BalanceItem) => {
    if (formType === 'asset') {
      if (editIndex !== null) {
        const updatedAssets = [...assets];
        updatedAssets[editIndex] = newItem;
        setAssets(updatedAssets);
      } else {
        setAssets([...assets, newItem]);
      }
    } else if (formType === 'liability') {
      if (editIndex !== null) {
        const updatedLiabilities = [...liabilities];
        updatedLiabilities[editIndex] = newItem;
        setLiabilities(updatedLiabilities);
      } else {
        setLiabilities([...liabilities, newItem]);
      }
    }
    closeForm();
  }

  // Delete an asset or liability
  const deleteItem = (type: 'asset' | 'liability', index: number) => {
    if (type === 'asset') {
      setAssets(assets.filter((_, i) => i !== index));
    } else {
      setLiabilities(liabilities.filter((_, i) => i !== index));
    }
  }

   // Calculate total assets
   const calculateTotalAssets = (): number => {
    return assets.reduce((total, asset) => total + Number(asset.value), 0);
  }

  // Calculate total liabilities
  const calculateTotalLiabilities = (): number => {
    return liabilities.reduce((total, liability) => total + Number(liability.value), 0);
  }

  // Calculate net worth
  const calculateLongTermEquity = (): number => {
    return calculateTotalAssets() - calculateTotalLiabilities();
  }

  // Calculate Net Worth
  //const netWorth = assets - liabilities;

  return (
    <div >
      <h1 className='recent-transactions-label'>Long Term Financial Items</h1>
      {/* Show the form if formVisible is true */}
      
      {formVisible && (
        <LineItemForm
          formData={formData}
          formType={formType}
          handleFormSubmit={handleFormSubmit}
          closeForm={closeForm}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        
      <div style={{ flex: 1, marginRight: '6%', marginTop: '2%' }}>
      <h2>Assets</h2>
      {assetTypes.map((type) => (
        <div key={type} style={{ marginTop: '3%', marginBottom: '3%' }}>
          <h3>{type}</h3>
          <Table>
            <TableHeader className='bg-[f9fafb]'>
                <TableRow>
                    <TableHead className="px-2">Name</TableHead>
                    <TableHead className="px-2">Value</TableHead>
                    <TableHead className="px-2">Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
              {getAssetsByType({type}).map((asset, index) => (
                  <TableRow key={index}>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>${asset.value}</TableCell>
                    <TableCell>
                      <Button style={{ backgroundColor: '#14ECF5', marginRight: '2%' }} onClick={() => openForm("asset", index, asset)}>Edit</Button>
                      <Button style={{ backgroundColor: '#F52B13' }} onClick={() => deleteItem("asset", index)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ))}
      <p style={{marginBottom: '2%', marginTop: '2%'}}>Total Assets: ${calculateTotalAssets().toFixed(2)}</p>
      <Button style={{ backgroundColor: '#14F57F' }} onClick={() => openForm('asset')}>Add Asset</Button>
      </div>


      <div style={{ flex: 1, marginLeft: '6%', marginTop: '2%' }}>
      <h2>Liabilities</h2>

      <Table style={{marginBottom: '3%'}}>
        <TableHeader className='bg-[f9fafb]'>
            <TableRow>
                    <TableHead className="px-2">Name</TableHead>
                    <TableHead className="px-2">Value</TableHead>
                    <TableHead className="px-2">Actions</TableHead>
                </TableRow>
        </TableHeader>

        <TableBody>
          {liabilities.map((liability, index) => (
            <TableRow
              key={index}
            >
              <TableCell>
                {liability.name}
              </TableCell>
              <TableCell>${liability.value}</TableCell>
              <TableCell>
                      <Button style={{ backgroundColor: '#14ECF5', marginRight: '2%'}} onClick={() => openForm("liability", index, liability)}>Edit</Button>
                      <Button style={{ backgroundColor: '#F52B13' }} onClick={() => deleteItem("liability", index)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p style={{marginBottom: '2%', marginTop: '2%'}}>Total Liabilities: ${calculateTotalLiabilities().toFixed(2)}</p>
      <Button style={{ backgroundColor: '#14F57F' }} onClick={() => openForm('liability')}>Add Liability</Button>
    </div>
      </div>
      <p style={{marginBottom: '2%', marginTop: '2%'}}>Equity from Long-Term Items: ${calculateLongTermEquity().toFixed(2)}</p>
    </div>
  );
};

export default BalanceSheet