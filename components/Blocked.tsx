"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BlockedProps {
  title?: string;
  description?: string;
  contactEmail?: string;
  estimatedTime?: string;
}

const Blocked: React.FC<BlockedProps> = ({
  title = "Website Under Maintenance",
  description = "We're currently performing scheduled maintenance to improve your experience. We apologize for any inconvenience and appreciate your patience.",
  contactEmail = "support@translexabl.com",
  estimatedTime = "We expect to be back online shortly"
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            {/* Maintenance Icon */}
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            
            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              {title}
            </CardTitle>
            
            <CardDescription className="text-muted-foreground text-base leading-relaxed">
              {description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            {/* Status Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">
                  Maintenance in Progress
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {estimatedTime}
              </p>
            </div>
            
            {/* What's Happening */}
            <div className="text-left space-y-3">
              <h3 className="font-semibold text-foreground text-sm">
                What we&apos;re working on:
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>System performance improvements</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Security updates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Database optimization</span>
                </li>
              </ul>
            </div>
            
            {/* Contact Section */}
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Need immediate assistance?
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = `mailto:${contactEmail}`}
                className="w-full"
              >
                Contact Support
              </Button>
            </div>
            
            {/* Footer */}
            <div className="text-xs text-muted-foreground">
              Thank you for your patience and understanding.
            </div>
          </CardContent>
        </Card>
        
        {/* Additional messaging */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Follow us for updates: 
            <span className="ml-2 text-primary font-medium">
              @translexabl
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blocked;
