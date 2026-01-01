import React from 'react'
import { Analytics } from "@vercel/analytics/next"
const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>{children}
            <Analytics /></div>
    )
}

export default layout