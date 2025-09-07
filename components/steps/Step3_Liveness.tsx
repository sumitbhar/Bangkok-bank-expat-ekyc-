
import React, { useState, useRef, useEffect } from 'react';
import { FormData } from '../../types';
import { CameraIcon } from '../icons/CameraIcon';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import Button from '../common/Button';
import Alert from '../common/Alert';

interface Props {
    nextStep: () => void;
    prevStep: () => void;
    updateFormData: (data: Partial<FormData>) => void;
}

const Step3Liveness: React.FC<Props> = ({ nextStep, prevStep, updateFormData }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasStream, setHasStream] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mediaStream: MediaStream | null = null;
        
        const initCamera = async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError("Your browser does not support camera access. Please use a more modern browser.");
                setIsLoading(false);
                return;
            }

            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setHasStream(true);
            } catch (err) {
                if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
                     setError("Camera access was denied. Please enable camera permissions in your browser settings to continue.");
                } else {
                     setError("Could not access the camera. Please ensure it is not in use by another application and try again.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        initCamera();

        return () => {
            // Stop all tracks on the stream when the component unmounts
            mediaStream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    const captureSelfie = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/png');
            
            updateFormData({ liveness: { selfie: dataUrl } });
            nextStep();
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-[--color-text-header] mb-2">Liveness Check</h2>
            <p className="text-[--color-text-body] mb-6">Please position your face within the frame and capture a selfie. Make sure the lighting is good.</p>
            
            <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                {isLoading && <SpinnerIcon className="h-12 w-12 text-white" />}
                {error && !isLoading && <div className="p-4"><Alert type="error" title="Camera Error" message={error} /></div>}
                <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transform -scale-x-100 ${isLoading || error ? 'hidden' : ''}`} onCanPlay={() => setIsLoading(false)}></video>
                {/* Face detection overlay */}
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[80%] rounded-[50%] border-4 border-white/70"
                    style={{ boxShadow: '0 0 0 50vmax rgba(0, 0, 0, 0.5)' }}
                    aria-hidden="true"
                ></div>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
            
             <div className="flex justify-between pt-6">
                <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>
                <Button 
                    onClick={captureSelfie} 
                    disabled={!hasStream || !!error}
                    variant="primary"
                >
                    <CameraIcon className="h-5 w-5" />
                    Capture Selfie
                </Button>
            </div>
        </div>
    );
};

export default Step3Liveness;