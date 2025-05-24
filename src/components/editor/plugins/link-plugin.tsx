'use client';

import { LinkPlugin } from '@udecode/plate-link/react';

import { LinkFloatingToolbar } from '~/components/editor/ui/link-floating-toolbar';

export const linkPlugin = LinkPlugin.extend({
  render: { afterEditable: () => <LinkFloatingToolbar /> },
});
