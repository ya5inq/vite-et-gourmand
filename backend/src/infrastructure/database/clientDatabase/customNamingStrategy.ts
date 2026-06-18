/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';

import { NamingStrategyInterface, DefaultNamingStrategy, Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName);
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join('_'));
  }

  columnNameCustomized(customName: string): string {
    return customName;
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    secondPropertyName: string,
  ): string {
    return snakeCase(`${firstTableName}_${firstPropertyName.replace(/\./gi, '_')}_${secondTableName}`);
  }

  joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
    return snakeCase(`${tableName}_ ${columnName ? columnName : propertyName}`);
  }

  classTableInheritanceParentColumnName(parentTableName: string, parentTableIdPropertyName: string): string {
    return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`);
  }

  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    _referencedTablePath?: string,
    _referencedColumnNames?: string[],
  ): string {
    const targetTableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const cols = columnNames.join('_');
    // Format: fk_<hash>_<table>_<cols>
    const refTable = _referencedTablePath || '';
    const refCols = _referencedColumnNames?.join('_') || '';
    const fullName = `${targetTableName}_${cols}_${refTable}_${refCols}`;
    const hash = this.generateShortHash(fullName);
    return `fk_${hash}_${this.truncateIdentifier(targetTableName, 20)}_${this.truncateIdentifier(cols, 20)}`;
  }

  uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    const targetTableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const cols = columnNames.join('_');
    const fullName = `${targetTableName}_${cols}`;
    const hash = this.generateShortHash(fullName);
    return `uq_${hash}_${this.truncateIdentifier(targetTableName, 22)}_${this.truncateIdentifier(cols, 22)}`;
  }

  indexName(tableOrName: Table | string, columnNames: string[]): string {
    const targetTableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const cols = columnNames.join('_');
    const fullName = `${targetTableName}_${cols}`;
    const hash = this.generateShortHash(fullName);
    return `idx_${hash}_${this.truncateIdentifier(targetTableName, 22)}_${this.truncateIdentifier(cols, 22)}`;
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    const targetTableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const cols = columnNames.join('_');
    const fullName = `${targetTableName}_${cols}`;
    const hash = this.generateShortHash(fullName);
    return `pk_${hash}_${this.truncateIdentifier(targetTableName, 23)}_${this.truncateIdentifier(cols, 23)}`;
  }

  private generateShortHash(input: string): string {
    const hash: string = crypto.createHash('md5').update(input).digest('hex');
    return hash.slice(0, 8);
  }

  /**
   * Tronque un identifiant à une longueur maximale en préservant la fin.
   */
  private truncateIdentifier(identifier: string, maxLength: number): string {
    if (identifier.length <= maxLength) {
      return identifier;
    }

    const keepStart = Math.floor(maxLength * 0.6);
    const keepEnd = maxLength - keepStart - 3; // -3 pour "..."

    if (keepEnd > 0) {
      return `${identifier.substring(0, keepStart)}...${identifier.substring(identifier.length - keepEnd)}`;
    }

    return identifier.substring(0, maxLength);
  }
}
