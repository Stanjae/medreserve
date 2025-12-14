'use client';
import { IconCreditCard } from '@tabler/icons-react';
import React from 'react'

const PaymentsSettingCard = () => {
      const puzzleDecoration = (
        <svg
          className="absolute top-4 right-4 w-16 h-16 opacity-10"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M50 0C50 13.8071 61.1929 25 75 25H100V50C86.1929 50 75 61.1929 75 75V100H50C50 86.1929 38.8071 75 25 75H0V50C13.8071 50 25 38.8071 25 25V0H50Z"
            fill="#FF6B6B"
          />
        </svg>
      );
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 relative overflow-hidden">
      {puzzleDecoration}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
          <IconCreditCard className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
      </div>
      <div className="space-y-4">
        <div className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/25</p>
            </div>
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
              Default
            </span>
          </div>
        </div>
        <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition text-gray-600 font-medium">
          + Add Payment Method
        </button>
      </div>
    </div>
  );
}

export default PaymentsSettingCard
