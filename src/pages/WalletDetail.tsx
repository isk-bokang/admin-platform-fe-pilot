import React from "react";
import { useParams } from 'react-router-dom';

function WalletDetail() {
  const params = useParams();

  console.log(params);

  return (
    <div>wallet detail</div>
  );
}

export default WalletDetail;
