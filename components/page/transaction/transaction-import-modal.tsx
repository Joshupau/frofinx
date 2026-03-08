import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useImportTransactions } from '@/queries/user/transaction/transaction';
import { useListWallets } from '@/queries/user/wallet/wallets';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface TransactionImportModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TransactionImportModal({ open, onClose, onSuccess }: TransactionImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [walletId, setWalletId] = useState<string>('');
  const { mutate, isSuccess, isError, error, reset } = useImportTransactions();
  const { data: walletsData, isLoading: walletsLoading } = useListWallets();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file || !walletId) return;
    setLoading(true);
    mutate({ file, walletId, preview: false }, {
      onSuccess: () => {
        setLoading(false);
        setFile(null);
        setWalletId('');
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: () => {
        setLoading(false);
      },
    });
  };
  console.log(walletsData);

  return (
     <Dialog open={open} onOpenChange={val => { if (!val) { reset(); onClose(); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Transactions</DialogTitle>
          </DialogHeader>
          {/* Wallet Select Dropdown */}
          <div className="mb-4">
            <label htmlFor="walletId" className="text-sm font-medium text-foreground block">
              Wallet *
            </label>
            <select
              id="walletId"
              name="walletId"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="">Select a wallet</option>
              {walletsData?.data && Array.isArray(walletsData.data.items) && walletsData.data.items.map((wallet: any) => (
                <option key={wallet._id || wallet.id} value={wallet._id || wallet.id}>
                  {wallet.name} ({wallet.currency || 'USD'})
                </option>
              ))}
            </select>
          </div>
          <Input type="file" accept=".csv,.xlsx" onChange={handleFileChange} />
          <DialogFooter>
            <Button onClick={handleImport} disabled={!file || !walletId || loading}>
              {loading ? 'Importing...' : 'Import'}
            </Button>
            <Button variant="outline" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          </DialogFooter>
          {isError && <div className="text-red-500 mt-2">{error?.message || 'Import failed.'}</div>}
          {isSuccess && <div className="text-green-500 mt-2">Import successful!</div>}
        </DialogContent>
      </Dialog>
  );
}
