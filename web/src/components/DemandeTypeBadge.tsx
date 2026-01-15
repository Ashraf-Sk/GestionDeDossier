import { getDemandeTypeInfo, DEMANDE_TYPES } from '../config/demandeTypes';

interface DemandeTypeBadgeProps {
  typeCode: string;
  showIcon?: boolean;
}

export default function DemandeTypeBadge({ typeCode, showIcon = true }: DemandeTypeBadgeProps) {
  const typeInfo = getDemandeTypeInfo(typeCode);

  if (!typeInfo) {
    return <span className="text-sm text-gray-600">{typeCode}</span>;
  }

  return (
    <div className="flex items-center space-x-2">
      {showIcon && <span className="text-lg">{typeInfo.icon}</span>}
      <span className="text-sm font-medium text-gray-700">{typeInfo.label}</span>
    </div>
  );
}
