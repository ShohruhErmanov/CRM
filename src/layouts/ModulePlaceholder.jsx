import { ArrowRight, FolderGit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button } from '../shared/components/ui';
import styles from './ModulePlaceholder.module.css';

/**
 * Clean integration slot for CRM modules currently being developed by teammates.
 */
export function ModulePlaceholder({ module }) {
  const Icon = module.icon;

  return (
    <section className={styles.card} aria-labelledby="placeholder-title">
      <div className={styles.header}>
        <div className={styles.iconBox} aria-hidden="true">
          <Icon size={22} />
        </div>
        <div>
          <Badge tone="info" dot>
            {module.ownerHint}
          </Badge>
          <h1 id="placeholder-title" className={styles.title} style={{ marginTop: '0.5rem' }}>
            {module.label}
          </h1>
          <p className={styles.subtitle}>{module.description}</p>
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.note}>
          Ushbu bo‘lim Finora CRM jamoaviy arxitekturasida alohida modul sifatida ajratilgan.
          Jamoadoshlar ushbu papka ichida o‘z komponentlari va hooklarini mustaqil yozib,
          umumiy dizayn tizimi (<code>src/shared/components/ui</code>) hamda rang tokenlaridan
          foydalanishlari mumkin.
        </p>

        <div className={styles.pathBox}>
          <FolderGit2 size={15} color="#3B82F6" aria-hidden="true" />
          <code>{module.featurePath}</code>
        </div>

        <div className={styles.actions}>
          <Link to="/customers">
            <Button variant="primary">
              Mijozlar bazasiga o‘tish
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
