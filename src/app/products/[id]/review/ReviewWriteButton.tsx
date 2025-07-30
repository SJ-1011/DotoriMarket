import React from 'react';

interface ReviewWriteButtonProps {
  canWriteReview: boolean;
  getButtonText: () => string;
  getButtonTooltip: () => string | undefined;
  onClick: () => void;
}

interface ToggleButtonProps {
  showMyReviewsOnly: boolean;
  onClick: () => void;
}

export function ReviewWriteButton({ canWriteReview, getButtonText, getButtonTooltip, onClick }: ReviewWriteButtonProps) {
  return (
    <button
      className={`px-4 py-2 text-sm ${!canWriteReview ? 'bg-gray-300 cursor-not-allowed text-gray-400' : 'bg-black text-white hover:bg-gray-800 cursor-pointer'}`}
      onClick={onClick}
      disabled={!canWriteReview}
      title={getButtonTooltip()}
    >
      {getButtonText()}
    </button>
  );
}

export function ReviewToggleButton({ showMyReviewsOnly, onClick }: ToggleButtonProps) {
  return (
    <button
      className="cursor-pointer border px-4 py-2 text-sm hover:bg-gray-100"
      onClick={onClick}
    >
      {showMyReviewsOnly ? '전체 후기 보기' : '내가 남긴 후기 보기'}
    </button>
  );
}