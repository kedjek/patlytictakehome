import React, { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";

const formatDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0'); 
  return `${year}/${month}/${day}`;
};

const TicketForm = (props) => {
      const [formData, setFormData] = useState({
        name: '',
        patentID: '',
        recaptcha: '',
      });

      const [analysis, setAnalysis] = useState({
        patent_id: "",
        company_name: "",
        analysis_date: "",
        top_infringing_products: [],
        overall_risk_assessment: ""
      })
    
      const [loading, setLoading] = useState(false); 

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.recaptcha || formData.patentID === '' || formData.name === '') {
          console.error('Please complete the reCAPTCHA and fill out name & patentID');
          return;
        }

        setLoading(true); 

        try {
          const { name, patentID } = formData;
          const payload = { name, patentID }

          const response = await fetch('/check-infringement', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
          });
          if (response.ok) {
            const data = await response.json();
            setAnalysis({
              patent_id: patentID,
              company_name: name,
              analysis_date: formatDate(), 
              top_infringing_products: data.top_infringing_products,
              overall_risk_assessment: data.overall_risk_assessment,
            });

          } else {
            console.error('Error while sending ticket to check-infringement:', response.statusText);
          }
            
        } catch (err) {
            console.error('Error caught when sending ticket:', err)
        }
      };
    
      const handleRecaptchaChange = (value) => {
        setFormData({ ...formData, recaptcha: value || ''});
      };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


  return (
    <div>
      <form onSubmit={handleSubmit} className='ticketBody'>
        <label>
          Company Name: <br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="ticketFieldBox"
          />
        </label>
        <br />

        <label>
          Patent ID: <br />
          <input
            type="text"
            name="patentID"
            value={formData.patentID}
            onChange={handleInputChange}
            className="ticketFieldBox"
          />
        </label>
        <br />

        {loading && <p>Loading, please wait...</p>} 
        <div className="ticketSubmitSection">
          <button type="submit" className="ticketSubmitButton">Submit</button>
          <ReCAPTCHA
            sitekey="6LeJBREpAAAAAKheig-GZamg98BkPdm_6vRErNnR"
            onChange={handleRecaptchaChange}
          />
        </div>
      </form>
      <div className="analysisBox">
        <h2>Analysis Result</h2>
        <p><strong>Patent ID:</strong> {analysis.patent_id}</p>
        <p><strong>Company Name:</strong> {analysis.company_name}</p>
        <p><strong>Analysis Date:</strong> {analysis.analysis_date}</p>

        <h3>Top Infringing Products</h3>
        <ul>
          {analysis.top_infringing_products.map((product, index) => (
            <li key={index}>
              <strong>{product.product_name}</strong>
              <p><strong>Infringement Likelihood:</strong> {product.infringement_likelihood}</p>
              <p><strong>Explanation:</strong> {product.explanation}</p>
              <p><strong>Specific Features:</strong></p>
              <ul>
                {product.specific_features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <h4>Overall Risk Assessment</h4>
        <p>{analysis.overall_risk_assessment}</p>
      </div>
    </div>
  );
};

export default TicketForm;