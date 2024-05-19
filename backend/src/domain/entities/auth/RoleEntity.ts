/**
 * Role: 権限
 *
 */
import {
  Entity,
  PrimaryColumn,
  // PrimaryGeneratedColumn,
  Column,
  // DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn
  // OneToOne,
  // ManyToOne,
  // OneToMany,
  // JoinColumn
} from 'typeorm'

@Entity('auth_roles')
export class RoleEntity {
  constructor(data: { roleId: string; roleName: string; sortOrder: number; isDeleted: boolean }) {
    this.roleId = data ? data.roleId : ''
    this.roleName = data ? data.roleName : ''
    this.sortOrder = data ? data.sortOrder : 0
    this.isDeleted = data ? data.isDeleted : false
  }

  @PrimaryColumn({ length: 256 })
  public roleId: string = ''

  @Column({ length: 32 })
  public roleName: string = ''

  @Column({ unsigned: true, default: () => 0 })
  public sortOrder: number = 0

  @Column({ default: () => false })
  public isDeleted: boolean = false

  @CreateDateColumn({ nullable: true })
  public createdAt?: Date

  @UpdateDateColumn({ nullable: true })
  public updatedAt?: Date

  @Column({ nullable: true })
  public createdById?: string

  @Column({ nullable: true })
  public updatedById?: string
}
