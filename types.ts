import React from 'react';

export interface UserData {
  email: string;
  role?: string;
  scriptsPerYear?: string;
  currentTool?: string;
  breakdownTime?: string;
}

export enum AppState {
  LANDING = 'LANDING',
  THANK_YOU = 'THANK_YOU',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  TERMS_OF_SERVICE = 'TERMS_OF_SERVICE'
}

export interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  align: 'left' | 'right';
  imageSrc: string;
}