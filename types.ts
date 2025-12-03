import React from 'react';

export interface UserData {
  email: string;
  role?: string;
  scriptsPerYear?: string;
  currentTool?: string;
}

export enum AppState {
  LANDING = 'LANDING',
  THANK_YOU = 'THANK_YOU'
}

export interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  align: 'left' | 'right';
  imageSrc: string;
}