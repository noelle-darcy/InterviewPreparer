import React from 'react'
import { motion } from 'framer-motion'

export const MotionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
    {children}
  </motion.div>
)
