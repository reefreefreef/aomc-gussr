import { useState } from "react"
import { useAuth } from './API';

export default function CurrentImage() {
    const { APIUrl } = useAuth();

    return (
        <img src={APIUrl+"/current"} id="current-image" />
    )
}