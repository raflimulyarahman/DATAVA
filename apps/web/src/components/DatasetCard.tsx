import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Database, Coins, TrendingUp, Wallet } from "lucide-react";

interface Dataset {
  id: number;
  title: string;
  description: string;
  owner: string;
  price: string;
  inferenceCount: number;
  category: string;
  size: string;
  license: string;
}

interface DatasetCardProps {
  dataset: Dataset;
}

export const DatasetCard = ({ dataset }: DatasetCardProps) => {
  return (
    <Card className="glass-card p-5 h-full flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <Badge variant="secondary">{dataset.category}</Badge>
        <Badge className="neon-text-purple">{dataset.license}</Badge>
      </div>
      
      <h3 className="text-lg font-bold mb-2 neon-text">{dataset.title}</h3>
      <p className="text-muted-foreground text-sm mb-4 flex-grow">{dataset.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Size:</span>
          <span>{dataset.size}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Price:</span>
          <span className="font-medium">{dataset.price}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Inferences:</span>
          <span className="flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            {dataset.inferenceCount}
          </span>
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-muted-foreground">Owner</span>
          <span className="text-xs font-mono text-primary">{dataset.owner}</span>
        </div>
        <Button className="w-full neon-border glow-hover">
          <Wallet className="w-4 h-4 mr-2" />
          Purchase
        </Button>
      </div>
    </Card>
  );
};