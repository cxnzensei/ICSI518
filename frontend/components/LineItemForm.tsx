// TAKEN FROM CHATGPT

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"

const assetTypes = ['Fixed Assets', 'Investments', 'Land/Buildings'];

type FormData = {
    name: string;
    value: number;
    assetType?: string; // Optional, only needed if the form is for an asset
  };
  
  type LineItemFormProps = {
    formData: FormData;
    formType: 'asset' | 'liability' | '';
    handleFormSubmit: (data: FormData) => void;
    closeForm: () => void;
  };
  

const LineItemForm: React.FC<LineItemFormProps> = ({ formData, formType, handleFormSubmit, closeForm }) => {
  const [formState, setFormState] = useState<FormData>(formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const submitForm = () => {
    handleFormSubmit(formState);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', border: '1px solid black' }}>
      <h3>{formType === 'asset' ? 'Add/Edit Asset' : 'Add/Edit Liability'}</h3>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={handleChange}
          style={{ marginLeft: '10px', marginBottom: '10px' }}
        />
      </label>
      <br />
      <label>
        Value:
        <input
          type="number"
          name="value"
          value={formState.value}
          onChange={handleChange}
          style={{ marginLeft: '10px', marginBottom: '10px' }}
        />
      </label>
      <br />
      {formType === 'asset' && (
        <label>
          Asset Type:
          <select
            name="assetType"
            value={formState.assetType}
            onChange={handleChange}
            style={{ marginLeft: '10px', marginBottom: '10px' }}
          >
            <option value="">Select Type</option>
            {assetTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      )}
      <br />
      <Button onClick={submitForm} style={{ marginRight: '10px' }}>
        Submit
      </Button>
      <Button onClick={closeForm}>Cancel</Button>
    </div>
  );
};

export default LineItemForm;