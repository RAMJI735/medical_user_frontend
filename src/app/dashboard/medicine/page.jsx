import React, { Suspense } from 'react'
import Medicine from '../../../../views/medicines'
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

function page() {
    return (
        <Suspense fallback={
            <Box sx={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617' }}>
                <CircularProgress sx={{ color: "#3b82f6" }} />
            </Box>
        }>
            <Medicine />
        </Suspense>
    )
}

export default page