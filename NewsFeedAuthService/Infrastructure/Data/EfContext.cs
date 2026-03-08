using Domain.Entities;

namespace Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class EfContext(DbContextOptions<EfContext> options): DbContext(options)
{
    public DbSet<User>? User { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("user_accounts");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.Property(e => e.Id)
              .HasColumnName("id")
              .UseIdentityColumn();

            entity.Property(e => e.Username)
              .HasColumnName("user_name")
              .HasMaxLength(100);

            entity.Property(e => e.Email)
              .HasColumnName("email")
              .HasMaxLength(254);

            entity.Property(e => e.PasswordHash)
              .HasColumnName("password_hash")
              .IsRequired();

            entity.Property(e => e.CreatedAt)
              .HasColumnName("created_at")
              .IsRequired();
        });
    }
}